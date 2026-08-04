const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = process.env.PAWFINDER_DB || path.join(__dirname, 'pawfinder.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initializeDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      city TEXT,
      password_hash TEXT NOT NULL,
      avatar_initials TEXT,
      paw_points INTEGER DEFAULT 100,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shelters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '🏥',
      address TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      hours TEXT,
      distance_km REAL,
      dogs_available INTEGER DEFAULT 0,
      dogs_rehomed INTEGER DEFAULT 0,
      volunteers INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.5,
      verified INTEGER DEFAULT 1,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dogs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      breed TEXT,
      age_text TEXT,
      age_months INTEGER,
      gender TEXT,
      weight_kg REAL,
      size TEXT,
      emoji TEXT DEFAULT '🐕',
      image_url TEXT,
      location TEXT,
      shelter_id TEXT REFERENCES shelters(id),
      about TEXT,
      vaccinated INTEGER DEFAULT 0,
      neutered INTEGER DEFAULT 0,
      dewormed INTEGER DEFAULT 0,
      microchipped INTEGER DEFAULT 0,
      good_with TEXT,
      energy_level TEXT,
      exercise TEXT,
      grooming TEXT,
      space TEXT,
      diet TEXT,
      traits TEXT,
      urgent INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      adopted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS favourites (
      user_id TEXT REFERENCES users(id),
      dog_id TEXT REFERENCES dogs(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, dog_id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      dog_id TEXT REFERENCES dogs(id),
      status TEXT DEFAULT 'pending',
      residence_type TEXT,
      outdoor_space TEXT,
      experience TEXT,
      other_pets TEXT,
      children TEXT,
      alone_hours TEXT,
      reason TEXT,
      progress INTEGER DEFAULT 25,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS application_documents (
      id TEXT PRIMARY KEY,
      application_id TEXT REFERENCES applications(id),
      doc_type TEXT NOT NULL,
      label TEXT,
      file_name TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT,
      size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      shelter_id TEXT REFERENCES shelters(id),
      user_id TEXT REFERENCES users(id),
      sender TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      title TEXT NOT NULL,
      body TEXT,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      emoji TEXT DEFAULT '📰',
      read_time TEXT,
      author TEXT,
      summary TEXT,
      content TEXT,
      likes INTEGER DEFAULT 0,
      bg_color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS foster_dogs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '🐕',
      breed TEXT,
      age_text TEXT,
      reason TEXT,
      duration TEXT,
      urgency TEXT DEFAULT 'medium',
      shelter_id TEXT REFERENCES shelters(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS volunteer_roles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      emoji TEXT,
      description TEXT,
      bg_color TEXT,
      spots_status TEXT DEFAULT 'open',
      spots_text TEXT
    );

    CREATE TABLE IF NOT EXISTS volunteer_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      event_date TEXT,
      attendees INTEGER DEFAULT 0,
      max_attendees INTEGER DEFAULT 30
    );
  `);

  migrate(db);
  seedData(db);
  syncContent(db);
  return db;
}

function migrate(db) {
  const userCols = db.prepare(`PRAGMA table_info(users)`).all();
  if (!userCols.some(c => c.name === 'is_admin')) {
    db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`);
  }
  db.prepare(`UPDATE users SET is_admin = 1 WHERE email = 'demo@pawfinder.in'`).run();

  // application_documents was added after the first release — create if missing
  const docTable = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='application_documents'`).get();
  if (!docTable) {
    db.exec(`
      CREATE TABLE application_documents (
        id TEXT PRIMARY KEY,
        application_id TEXT REFERENCES applications(id),
        doc_type TEXT NOT NULL,
        label TEXT,
        file_name TEXT NOT NULL,
        original_name TEXT,
        mime_type TEXT,
        size INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
  }
}

function seedData(db) {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount > 0) return;

  const demoHash = bcrypt.hashSync('demo123', 10);
  db.prepare(`INSERT INTO users (id, name, email, phone, city, password_hash, avatar_initials, paw_points, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`).run(
    'demo-user', 'Adithya Kumar', 'demo@pawfinder.in', '+91 9876543210', 'Coimbatore', demoHash, 'AK', 240
  );

  const notifications = [
    ['n1','demo-user','Welcome to PawFinder! 🐾','Start by browsing dogs available for adoption across Coimbatore.',0],
    ['n2','demo-user','Bruno is waiting for you!','You viewed Bruno earlier. He is still available for adoption in R.S. Puram, Coimbatore.',0],
    ['n3','demo-user','New dogs added near you','Fresh rescues were added across Coimbatore shelters this week.',1]
  ];
  const notifStmt = db.prepare(`INSERT INTO notifications (id,user_id,title,body,read) VALUES (?,?,?,?,?)`);
  for (const n of notifications) notifStmt.run(...n);
}

// Idempotent catalogue sync — runs every boot. INSERT OR IGNORE keeps existing
// rows, users, applications and documents untouched while adding new content.
function syncContent(db) {
  // ── Shelters — all Coimbatore ──
  const shelters = [
    ['s1', 'Humane Animal Society', '🏥', 'Saibaba Colony, Coimbatore', 'Coimbatore', '+91 422 244 5678', 'care@haskovai.org', '9AM-5PM', 2.1, 52, 384, 92, 4.9, 1, 'Verified,No-Kill,Since 1996'],
    ['s2', 'Kongu Animal Rescue', '🐾', 'Gandhipuram, Coimbatore', 'Coimbatore', '+91 422 249 1089', 'help@konguanimalrescue.org', '8AM-6PM', 3.4, 41, 219, 58, 4.7, 1, 'Verified,Rescue,Rehab'],
    ['s3', 'Blue Cross of Coimbatore', '🏠', 'R.S. Puram, Coimbatore', 'Coimbatore', '+91 422 247 2345', 'info@bluecrosskovai.org', '9AM-4PM', 1.8, 37, 198, 44, 4.6, 1, 'Verified,Adoption,Medical'],
    ['s4', 'Paws & Care Kovai', '💚', 'Peelamedu, Coimbatore', 'Coimbatore', '+91 422 257 5566', 'hello@pawscarekovai.org', '10AM-6PM', 5.6, 33, 142, 49, 4.5, 1, 'Rescue,Foster,Education'],
    ['s5', 'Street Dog Care Coimbatore', '🐕', 'Race Course, Coimbatore', 'Coimbatore', '+91 422 231 3344', 'sdc@coimbatore.org', '8AM-5PM', 3.0, 29, 121, 36, 4.5, 1, 'Verified,Sterilization,Feeding'],
    ['s6', 'Second Chance Kovai', '🌟', 'Saravanampatti, Coimbatore', 'Coimbatore', '+91 422 266 8877', 'team@secondchancekovai.org', '9AM-5PM', 7.9, 24, 88, 21, 4.3, 1, 'Foster,Special Needs'],
    ['s7', 'Nilgiris Foothills Rescue', '⛰️', 'Mettupalayam Road, Coimbatore', 'Coimbatore', '+91 422 268 4422', 'rescue@nilgirisfoothills.org', '9AM-5PM', 12.4, 27, 73, 19, 4.4, 1, 'Verified,Rescue,Hill-region'],
    ['s8', 'Vadavalli Animal Trust', '🐶', 'Vadavalli, Coimbatore', 'Coimbatore', '+91 422 242 9911', 'trust@vadavallianimals.org', '8AM-4PM', 6.2, 22, 64, 17, 4.2, 1, 'Adoption,Community'],
    ['s9', 'Kovai Pet Sanctuary', '🦴', 'Kuniyamuthur, Coimbatore', 'Coimbatore', '+91 422 260 7788', 'sanctuary@kovaipets.org', '9AM-6PM', 8.8, 19, 57, 14, 4.1, 1, 'Sanctuary,Senior dogs'],
    ['s10', 'Pollachi Paws Foundation', '🐾', 'Pollachi Main Road, Coimbatore', 'Coimbatore', '+91 4259 22 3344', 'paws@pollachifoundation.org', '8AM-5PM', 38.0, 18, 49, 12, 4.0, 1, 'Rural rescue,Verified'],
    ['s11', 'Annur Animal Aid', '💙', 'Annur, Coimbatore', 'Coimbatore', '+91 4254 23 1122', 'aid@annuranimals.org', '9AM-4PM', 28.5, 14, 41, 9, 3.9, 0, 'Rural rescue,Community'],
    ['s12', 'Sulur Rescue Collective', '🤝', 'Sulur, Coimbatore', 'Coimbatore', '+91 422 268 9090', 'collective@sulurrescue.org', '9AM-5PM', 18.7, 16, 38, 11, 4.1, 1, 'Rescue,Foster'],
    ['s13', 'Coimbatore Animal Welfare Trust', '🏥', 'Ramanathapuram, Coimbatore', 'Coimbatore', '+91 422 232 7766', 'cawt@kovaiwelfare.org', '9AM-5PM', 4.2, 38, 176, 47, 4.7, 1, 'Verified,No-Kill,Medical'],
    ['s14', 'Tail Waggers Rescue', '🐕', 'Singanallur, Coimbatore', 'Coimbatore', '+91 422 258 4433', 'hello@tailwaggerskovai.org', '8AM-6PM', 5.1, 31, 134, 38, 4.6, 1, 'Verified,Adoption,Foster'],
    ['s15', 'Kovai Compassion Home', '💚', 'Thudiyalur, Coimbatore', 'Coimbatore', '+91 422 264 5511', 'care@kovaicompassion.org', '9AM-5PM', 9.3, 26, 97, 28, 4.4, 1, 'Sanctuary,Special Needs'],
    ['s16', 'Ganesh Animal Shelter', '🐾', 'Ondipudur, Coimbatore', 'Coimbatore', '+91 422 257 8822', 'shelter@ganeshanimals.org', '8AM-5PM', 7.4, 23, 81, 22, 4.3, 1, 'Rescue,Community,Feeding'],
    ['s17', 'Kovai Indie Care', '🐶', 'Ganapathy, Coimbatore', 'Coimbatore', '+91 422 233 9090', 'indie@kovaicare.org', '9AM-6PM', 3.7, 35, 112, 33, 4.6, 1, 'Verified,Indie-focus,Sterilization'],
    ['s18', 'Western Ghats Animal Refuge', '⛰️', 'Thondamuthur, Coimbatore', 'Coimbatore', '+91 422 245 1212', 'refuge@westernghatsanimals.org', '9AM-4PM', 16.8, 21, 64, 18, 4.2, 1, 'Verified,Rescue,Hill-region'],
    ['s19', 'Karumathampatti Animal Aid', '🤝', 'Karumathampatti, Coimbatore', 'Coimbatore', '+91 4257 22 4545', 'aid@karumathampatti.org', '9AM-5PM', 22.4, 17, 43, 12, 4.0, 0, 'Rural rescue,Community'],
    ['s20', 'Madukkarai Street Animal Project', '🌟', 'Madukkarai, Coimbatore', 'Coimbatore', '+91 422 264 3377', 'team@madukkaraistreet.org', '8AM-5PM', 14.1, 19, 56, 15, 4.1, 1, 'Sterilization,Feeding,Verified']
  ];

  const shelterStmt = db.prepare(`INSERT OR IGNORE INTO shelters (id, name, emoji, address, city, phone, email, hours, distance_km, dogs_available, dogs_rehomed, volunteers, rating, verified, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const s of shelters) shelterStmt.run(...s);

  // ── Dogs — all Coimbatore locations ──
  const dogs = [
    ['dog-1','Bruno','Labrador Mix','2 yrs',24,'Male',18,'Medium','🐕','','R.S. Puram, Coimbatore','s3','Bruno was rescued from a construction site near R.S. Puram as a puppy. He has since transformed into the most lovable, well-mannered companion. House-trained, leash-trained, and incredibly gentle with children.',1,1,1,1,'Kids,Cats,Dogs','High','2 walks per day (30 min each)','Low maintenance','Apartment-friendly','Dry kibble, 2x daily','Playful,Loyal,Gentle,Smart',0,1,0],
    ['dog-2','Bella','Indie','1 yr',12,'Female',12,'Medium','🐕‍🦺','','Gandhipuram, Coimbatore','s2','Bella is a sweet indie girl rescued from the busy streets of Gandhipuram. She is shy at first but warms up quickly. Perfect for a quiet household.',1,1,1,0,'Adults,Dogs','Medium','1-2 walks per day','Low maintenance','Apartment-friendly','Home food or kibble','Shy,Sweet,Calm,Affectionate',0,0,0],
    ['dog-3','Rocky','GSD Mix','3 yrs',36,'Male',25,'Large','🦮','','Saibaba Colony, Coimbatore','s1','Rocky is a German Shepherd mix with incredible loyalty. Previously a guard dog at a Saibaba Colony warehouse, he now seeks a loving family. Well-trained and protective.',1,1,1,1,'Adults,Older kids','High','2-3 walks per day','Regular brushing needed','House with yard preferred','Premium kibble, 2x daily','Protective,Loyal,Alert,Brave',0,0,0],
    ['dog-4','Luna','Indie','8 mo',8,'Female',8,'Small','🐶','','Race Course, Coimbatore','s5','Luna is an adorable puppy found near Race Course road. Full of energy and love. She needs a family who can give her time and training.',1,0,1,0,'Everyone','Very High','Multiple walks + playtime','Low maintenance','Any home','Puppy food, 3x daily','Energetic,Curious,Friendly,Playful',0,0,0],
    ['dog-5','Max','Labrador','4 yrs',48,'Male',28,'Large','🐕','','Peelamedu, Coimbatore','s4','Max is a purebred Labrador surrendered by his family due to relocation from Peelamedu. He is house-trained, knows commands, and is great with children.',1,1,1,1,'Everyone','Medium','2 walks per day','Moderate shedding','House preferred','Kibble + rice, 2x daily','Obedient,Gentle,Calm,Trained',0,0,0],
    ['dog-6','Charlie','Indie','7 yrs',84,'Male',15,'Medium','🐕','','Gandhipuram, Coimbatore','s2','Charlie is a senior indie boy looking for a quiet retirement home. He is calm, house-trained, and loves belly rubs. Low maintenance companion.',1,1,1,1,'Adults,Seniors','Low','1 gentle walk per day','Low maintenance','Apartment-friendly','Soft food + kibble','Calm,Gentle,Low-key,Loving',1,0,0],
    ['dog-7','Daisy','Pomeranian Mix','2 yrs',24,'Female',5,'Small','🐩','','Saibaba Colony, Coimbatore','s1','Daisy is a fluffy Pomeranian mix with a big personality. She loves attention and will follow you everywhere. Great apartment dog.',1,1,1,0,'Adults,Older kids','Medium','Short walks + indoor play','Regular grooming needed','Apartment-friendly','Small breed kibble, 2x daily','Sassy,Loyal,Alert,Cuddly',0,0,0],
    ['dog-8','Rex','Indie','1.5 yrs',18,'Male',20,'Medium','🦮','','Saravanampatti, Coimbatore','s6','Rex was found injured on the Saravanampatti bypass and nursed back to health. He is now fully recovered and looking for his forever family. Very grateful and loyal.',1,1,1,0,'Adults,Dogs','High','2 long walks per day','Low maintenance','House with yard preferred','Rice + chicken, 2x daily','Grateful,Energetic,Loyal,Brave',0,0,0],
    ['dog-9','Coco','Spitz Mix','3 yrs',36,'Female',7,'Small','🐩','','R.S. Puram, Coimbatore','s3','Coco is a beautiful Spitz mix who was abandoned near R.S. Puram market. She has a gorgeous white coat and loves to be pampered. Ideal for families.',1,1,1,1,'Everyone','Medium','1-2 walks + indoor play','Regular grooming','Apartment-friendly','Small breed kibble','Elegant,Playful,Social,Sweet',0,0,0],
    ['dog-10','Buddy','Indie','5 yrs',60,'Male',22,'Large','🐕','','Vadavalli, Coimbatore','s8','Buddy is a strong, healthy indie who has been at the Vadavalli shelter for over a year. He is well-socialized with other dogs and very obedient.',1,1,1,1,'Everyone','Medium','2 walks per day','Low maintenance','Any home','Kibble + home food','Friendly,Obedient,Social,Patient',0,0,0],
    ['dog-11','Tiger','Indie','9 yrs',108,'Male',18,'Medium','🐕','','Saibaba Colony, Coimbatore','s1','Tiger is a senior boy with the gentlest soul. He has been at the shelter the longest and deserves a warm home for his golden years.',1,1,1,1,'Adults,Seniors','Very Low','Short gentle walks','Low maintenance','Apartment-friendly','Senior diet, 2x daily','Gentle,Calm,Wise,Loving',1,0,0],
    ['dog-12','Peanut','Pomeranian Mix','3 mo',3,'Male',2,'Small','🐶','','Peelamedu, Coimbatore','s4','Peanut is the tiniest fluffball you will ever meet! Rescued as a newborn near Peelamedu, bottle-fed by volunteers. He needs a patient, loving home.',0,0,1,0,'Experienced owners','Very High','Supervised play','Future grooming needs','Apartment-friendly','Puppy formula + soft food','Tiny,Playful,Curious,Needy',0,0,0],
    ['dog-13','Ginger','Indie','2 yrs',24,'Female',14,'Medium','🐕‍🦺','','Singanallur, Coimbatore','s2','Ginger is a beautiful brown indie with expressive eyes. She was rescued from the Singanallur lake area and has been waiting for a family since.',1,1,1,0,'Everyone','Medium','2 walks per day','Low maintenance','Any home','Home food or kibble','Expressive,Sweet,Resilient,Calm',0,0,0],
    ['dog-14','Shadow','Doberman Mix','4 yrs',48,'Male',30,'Large','🦮','','Saravanampatti, Coimbatore','s6','Shadow is a majestic Doberman mix with a gentle heart. Despite his size, he is incredibly gentle and well-trained.',1,1,1,1,'Experienced owners','High','Long runs or walks','Regular grooming','House with yard','High protein kibble','Majestic,Gentle,Protective,Smart',0,0,0],
    ['dog-15','Nila','Indie','1 yr',12,'Female',10,'Medium','🐕‍🦺','','Kuniyamuthur, Coimbatore','s9','Nila (meaning moon) is a beautiful white indie girl rescued near Kuniyamuthur. She is incredibly social and great with other dogs.',1,0,1,0,'Everyone','High','Long walks preferred','Low maintenance','Any home','Kibble + fish','Social,Active,Friendly,Gentle',0,0,0],
    ['dog-16','Simba','Indie','8 yrs',96,'Male',20,'Medium','🐕','','Gandhipuram, Coimbatore','s2','Simba is a dignified senior who still has lots of love to give. He was a community dog cared for by Gandhipuram shopkeepers until he needed medical attention.',1,1,1,1,'Adults','Low','Short walks','Low maintenance','Apartment-friendly','Senior diet','Dignified,Calm,Loyal,Gentle',1,0,0],
    ['dog-17','Pepper','Indie','6 mo',6,'Female',6,'Small','🐶','','R.S. Puram, Coimbatore','s3','Pepper is a spunky little puppy with a spotted coat. She was found near an R.S. Puram temple and is looking for her first real home.',1,0,1,0,'Everyone','Very High','Lots of playtime!','Low maintenance','Any home','Puppy food, 3x daily','Spunky,Spotted,Energetic,Adorable',0,0,0],
    ['dog-18','Duke','Lab Mix','5 yrs',60,'Male',26,'Large','🐕','','Peelamedu, Coimbatore','s4','Duke is a calm, well-mannered Lab mix who was surrendered when his family emigrated from Peelamedu. He is house-trained and knows several commands.',1,1,1,1,'Everyone','Low-Medium','1-2 walks per day','Moderate shedding','House preferred','Kibble, 2x daily','Calm,Trained,Gentle,Patient',0,0,0],
    ['dog-19','Ranger','Indie','6 yrs',72,'Male',24,'Large','🦮','','Mettupalayam Road, Coimbatore','s7','Ranger is a large, brave indie who protects everyone at the Nilgiris Foothills shelter. He needs an experienced owner who can match his strong personality.',1,1,1,0,'Experienced owners','High','Long walks required','Low maintenance','House with yard','High protein diet','Brave,Protective,Strong,Loyal',1,0,0],
    ['dog-20','Biscuit','Indie','5 mo',5,'Male',4,'Small','🐶','','Saibaba Colony, Coimbatore','s1','Biscuit is a golden-brown puppy who melts hearts. Recently rescued and fully vaccinated, ready for his forever home!',1,0,1,0,'Everyone','Very High','Puppy energy!','Low maintenance','Any home','Puppy food, 3x daily','Golden,Sweet,Playful,New',0,0,0],
    ['dog-21','Apollo','Indie','3 yrs',36,'Male',19,'Medium','🐕','','Gandhipuram, Coimbatore','s2','Apollo is a handsome indie with a regal bearing. He is calm, independent, and makes a great companion for working professionals.',1,1,1,1,'Adults','Medium','1-2 walks per day','Low maintenance','Apartment-friendly','Kibble + home food','Independent,Calm,Regal,Smart',0,0,0],
    ['dog-22','Honey','Labrador','4 yrs',48,'Female',24,'Large','🐕‍🦺','','Race Course, Coimbatore','s5','Honey is a sweet Labrador girl who loves everyone she meets. Previously a therapy dog, she brings joy wherever she goes.',1,1,1,1,'Everyone','Medium','2 walks per day','Regular brushing','House preferred','Lab diet, 2x daily','Therapeutic,Sweet,Loving,Patient',0,0,0],
    ['dog-23','Storm','GSD Mix','2 yrs',24,'Male',27,'Large','🦮','','Saravanampatti, Coimbatore','s6','Storm is a striking GSD mix with wolf-like features. He is intelligent, trainable, and bonds deeply with his person.',1,1,1,0,'Experienced owners','Very High','Vigorous exercise needed','Regular grooming','House with yard','High protein kibble','Striking,Intelligent,Athletic,Bonded',0,0,0],
    ['dog-24','Mochi','Indie','4 mo',4,'Female',3,'Small','🐶','','Kuniyamuthur, Coimbatore','s9','Mochi is the cutest puppy at the sanctuary! She has floppy ears and a wagging tail that never stops. Perfect first dog.',1,0,1,0,'Everyone','Very High','Non-stop play!','Low maintenance','Any home','Puppy food, 3x daily','Cute,Floppy-eared,Waggy,Happy',0,0,0],
    ['dog-25','Leo','Indie','2 yrs',24,'Male',21,'Medium','🐕','','Vadavalli, Coimbatore','s8','Leo is a confident, friendly boy rescued from the Vadavalli hills. He loves car rides and is great with kids of all ages.',1,1,1,0,'Everyone','High','2 walks + playtime','Low maintenance','Any home','Kibble + home food','Confident,Friendly,Active,Loyal',0,0,0],
    ['dog-26','Zara','Indie','1.5 yrs',18,'Female',13,'Medium','🐕‍🦺','','Sulur, Coimbatore','s12','Zara was rescued from a Sulur poultry farm where she was abandoned. She is gentle, food-motivated, and learns fast.',1,1,1,0,'Everyone','Medium','2 walks per day','Low maintenance','Any home','Kibble, 2x daily','Gentle,Smart,Food-motivated,Sweet',0,0,0],
    ['dog-27','Toby','Beagle Mix','3 yrs',36,'Male',14,'Medium','🐶','','Saibaba Colony, Coimbatore','s1','Toby is a curious Beagle mix with the best nose in the shelter. He is playful, vocal, and loves sniffing adventures.',1,1,1,1,'Older kids,Dogs','High','2 long sniffy walks','Low maintenance','House preferred','Kibble, 2x daily','Curious,Playful,Vocal,Friendly',0,0,0],
    ['dog-28','Misty','Indie','10 yrs',120,'Female',16,'Medium','🐕','','Kuniyamuthur, Coimbatore','s9','Misty is a gentle grandma dog who just wants a soft bed and a calm home for her sunset years. Incredibly affectionate.',1,1,1,1,'Adults,Seniors','Very Low','Short slow strolls','Low maintenance','Apartment-friendly','Senior soft diet','Gentle,Affectionate,Calm,Wise',1,0,0],
    ['dog-29','Jack','Indie','7 mo',7,'Male',9,'Medium','🐶','','Pollachi Main Road, Coimbatore','s10','Jack is an energetic pup rescued from rural Pollachi. He is smart, bold, and would thrive with an active family.',1,0,1,0,'Everyone','Very High','Lots of exercise','Low maintenance','House with yard','Puppy food, 3x daily','Energetic,Bold,Smart,Playful',0,0,0],
    ['dog-30','Ruby','Indie','3 yrs',36,'Female',15,'Medium','🐕‍🦺','','Annur, Coimbatore','s11','Ruby is a calm, watchful girl rescued from Annur. She bonds with one person deeply and is a wonderful loyal companion.',1,1,1,0,'Adults','Medium','2 walks per day','Low maintenance','Any home','Kibble + home food','Calm,Watchful,Loyal,Bonded',0,0,0],
    ['dog-31','Oscar','Lab Mix','6 yrs',72,'Male',27,'Large','🐕','','Peelamedu, Coimbatore','s4','Oscar is a big gentle Lab mix who was a beloved pet until his owner passed away. He is house-trained and superb with children.',1,1,1,1,'Everyone','Medium','2 walks per day','Moderate shedding','House preferred','Kibble + rice, 2x daily','Gentle,Loving,Trained,Patient',0,0,0],
    ['dog-32','Pixie','Spitz Mix','1 yr',12,'Female',6,'Small','🐩','','R.S. Puram, Coimbatore','s3','Pixie is a tiny dynamo with a fluffy coat and endless energy. She is great for an apartment with an attentive family.',1,1,1,0,'Adults,Older kids','High','Short walks + indoor play','Regular grooming','Apartment-friendly','Small breed kibble','Energetic,Fluffy,Alert,Sweet',0,0,0],
    ['dog-33','Bear','Indie','4 yrs',48,'Male',29,'Large','🦮','','Mettupalayam Road, Coimbatore','s7','Bear is a big, calm hill-region indie with a teddy-bear face. Despite his size he is a gentle giant who loves cuddles.',1,1,1,0,'Everyone','Medium','2 walks per day','Seasonal shedding','House with yard','Kibble, 2x daily','Gentle-giant,Calm,Cuddly,Loyal',0,0,0],
    ['dog-34','Lucy','Indie','9 mo',9,'Female',11,'Medium','🐶','','Sulur, Coimbatore','s12','Lucy is a bright, affectionate adolescent rescued near Sulur airport road. She is eager to learn and loves people.',1,0,1,0,'Everyone','High','Walks + training games','Low maintenance','Any home','Puppy/adult mix, 3x daily','Bright,Affectionate,Eager,Friendly',0,0,0],
    ['dog-35','Rambo','GSD Mix','5 yrs',60,'Male',31,'Large','🦮','','Saravanampatti, Coimbatore','s6','Rambo is a powerful, devoted GSD mix who needs an experienced handler. With the right family he is unwaveringly loyal.',1,1,1,1,'Experienced owners','Very High','Intense daily exercise','Regular grooming','House with yard','High protein kibble','Powerful,Devoted,Smart,Protective',0,0,0],
    ['dog-36','Olive','Indie','2 yrs',24,'Female',13,'Medium','🐕‍🦺','','Gandhipuram, Coimbatore','s2','Olive is a soft-natured girl who was found caring for her pups under a Gandhipuram flyover. Her pups were adopted; now it is her turn.',1,1,1,0,'Everyone','Medium','2 gentle walks per day','Low maintenance','Any home','Kibble + home food','Soft-natured,Maternal,Sweet,Calm',1,0,0],
    ['dog-37','Scooby','Great Dane Mix','3 yrs',36,'Male',38,'Large','🦮','','Ramanathapuram, Coimbatore','s13','Scooby is a gentle giant rescued from a closed-down breeding setup near Ramanathapuram. Despite his size he is a goofy, affectionate softie.',1,1,1,1,'Adults,Older kids','Medium','2 long walks per day','Moderate shedding','House with yard','High protein kibble','Goofy,Gentle-giant,Affectionate,Calm',0,0,0],
    ['dog-38','Maya','Indie','1 yr',12,'Female',11,'Medium','🐕‍🦺','','Singanallur, Coimbatore','s14','Maya is a bright-eyed young girl rescued near Singanallur lake. She is playful, quick to learn, and adores children.',1,1,1,0,'Everyone','High','2 walks + play','Low maintenance','Any home','Kibble, 2x daily','Bright,Playful,Quick-learner,Gentle',0,0,0],
    ['dog-39','Toffee','Indie','6 mo',6,'Male',7,'Small','🐶','','Thudiyalur, Coimbatore','s15','Toffee is a caramel-coated pup with floppy ears and an endless tail wag. Rescued with his littermates from a Thudiyalur roadside.',1,0,1,0,'Everyone','Very High','Lots of play + short walks','Low maintenance','Any home','Puppy food, 3x daily','Caramel,Waggy,Playful,Sweet',0,0,0],
    ['dog-40','Bruno II','Rottweiler Mix','4 yrs',48,'Male',34,'Large','🦮','','Ondipudur, Coimbatore','s16','A powerful but deeply loyal Rottweiler mix surrendered when his guardian moved abroad. Needs an experienced, confident handler.',1,1,1,1,'Experienced owners','High','Vigorous daily exercise','Low maintenance','House with yard','High protein kibble','Powerful,Loyal,Protective,Smart',0,0,0],
    ['dog-41','Chinni','Indie','2 yrs',24,'Female',12,'Medium','🐕','','Ganapathy, Coimbatore','s17','Chinni is a sweet, low-key indie who was a community dog near Ganapathy market until a fracture needed treatment. Fully recovered now.',1,1,1,0,'Everyone','Medium','2 gentle walks per day','Low maintenance','Apartment-friendly','Kibble + home food','Sweet,Low-key,Grateful,Calm',0,0,0],
    ['dog-42','Rusty','Indie','7 yrs',84,'Male',19,'Medium','🐕','','Thondamuthur, Coimbatore','s18','Rusty is a wise senior from the Western Ghats foothills. Calm and undemanding, he just wants a warm bed and gentle company.',1,1,1,1,'Adults,Seniors','Low','Short gentle walks','Low maintenance','Apartment-friendly','Senior diet, 2x daily','Wise,Calm,Gentle,Loyal',1,0,0],
    ['dog-43','Snowy','Spitz Mix','1.5 yrs',18,'Female',6,'Small','🐩','','Ganapathy, Coimbatore','s17','Snowy is a fluffy white charmer who loves laps and gentle brushing sessions. Ideal apartment companion for an attentive family.',1,1,1,0,'Adults,Older kids','Medium','Short walks + indoor play','Regular grooming','Apartment-friendly','Small breed kibble','Fluffy,Charming,Cuddly,Alert',0,0,0],
    ['dog-44','Kalu','Indie','3 yrs',36,'Male',21,'Medium','🐕','','Madukkarai, Coimbatore','s20','Kalu is a striking black indie rescued during a Madukkarai sterilization drive. Confident, friendly and brilliant with other dogs.',1,1,1,0,'Everyone','High','2 walks + play','Low maintenance','Any home','Kibble, 2x daily','Striking,Confident,Friendly,Social',0,0,0],
    ['dog-45','Dolly','Beagle Mix','2 yrs',24,'Female',13,'Medium','🐶','','Singanallur, Coimbatore','s14','Dolly is a sniffy, food-loving Beagle mix with the sweetest howl. She thrives with an active family that enjoys long walks.',1,1,1,1,'Everyone','High','2 long sniffy walks','Low maintenance','House preferred','Kibble, 2x daily','Sniffy,Sweet,Food-loving,Vocal',0,0,0],
    ['dog-46','Thor','GSD Mix','5 yrs',60,'Male',32,'Large','🦮','','Ramanathapuram, Coimbatore','s13','Thor is a noble, intelligent GSD mix who served as a watchdog. He bonds intensely with his person and needs a job to do.',1,1,1,1,'Experienced owners','Very High','Intense daily exercise','Regular grooming','House with yard','High protein kibble','Noble,Intelligent,Devoted,Alert',0,0,0],
    ['dog-47','Mimi','Indie','5 mo',5,'Female',5,'Small','🐶','','Thudiyalur, Coimbatore','s15','Mimi is a tiny, curious explorer rescued from a storm drain near Thudiyalur. Bottle-raised by volunteers, she needs a patient home.',1,0,1,0,'Experienced owners','Very High','Supervised play','Low maintenance','Apartment-friendly','Puppy formula + soft food','Tiny,Curious,Brave,Needy',0,0,0],
    ['dog-48','Caesar','Indie','8 yrs',96,'Male',23,'Medium','🐕','','Ondipudur, Coimbatore','s16','Caesar is a dignified elder who spent years as a beloved neighbourhood dog in Ondipudur before his caretakers moved away.',1,1,1,1,'Adults,Seniors','Low','Short walks','Low maintenance','Apartment-friendly','Senior soft diet','Dignified,Calm,Loyal,Gentle',1,0,0],
    ['dog-49','Pippa','Indie','10 mo',10,'Female',10,'Medium','🐕‍🦺','','Karumathampatti, Coimbatore','s19','Pippa is a joyful adolescent rescued from rural Karumathampatti. Eager to please and wonderful with kids of all ages.',1,0,1,0,'Everyone','High','Walks + training games','Low maintenance','Any home','Puppy/adult mix, 3x daily','Joyful,Eager,Friendly,Smart',0,0,0],
    ['dog-50','Rocky II','Indie','4 yrs',48,'Male',24,'Large','🐕','','Madukkarai, Coimbatore','s20','Rocky is a strong, even-tempered indie who guarded a Madukkarai workshop. Well-socialised and steady with the right family.',1,1,1,0,'Adults,Dogs','Medium','2 walks per day','Low maintenance','House preferred','Kibble + home food','Strong,Steady,Even-tempered,Loyal',0,0,0],
    ['dog-51','Bubbles','Pomeranian Mix','1 yr',12,'Female',5,'Small','🐩','','Ramanathapuram, Coimbatore','s13','Bubbles is a pint-sized bundle of fluff and personality. She loves attention and is perfectly suited to apartment living.',1,1,1,0,'Adults,Older kids','Medium','Short walks + indoor play','Regular grooming','Apartment-friendly','Small breed kibble, 2x daily','Pint-sized,Sassy,Cuddly,Alert',0,0,0],
    ['dog-52','Hero','Indie','6 yrs',72,'Male',25,'Large','🦮','','Thondamuthur, Coimbatore','s18','Hero earned his name protecting a litter during a flood near Thondamuthur. Brave and devoted, he needs a confident, loving owner.',1,1,1,1,'Experienced owners','High','Long walks required','Low maintenance','House with yard','High protein diet','Brave,Devoted,Protective,Strong',1,0,0]
  ];

  const dogStmt = db.prepare(`INSERT OR IGNORE INTO dogs (id,name,breed,age_text,age_months,gender,weight_kg,size,emoji,image_url,location,shelter_id,about,vaccinated,neutered,dewormed,microchipped,good_with,energy_level,exercise,grooming,space,diet,traits,urgent,featured,adopted) VALUES (${Array(27).fill('?').join(',')})`);
  for (const d of dogs) dogStmt.run(...d);

  const articles = [
    ['a1','How to prepare your home for a new dog','Tips','🏠','4 min','Dr. Priya Sharma','Essential checklist before bringing your adopted dog home','<h2>Before the Big Day</h2><p>Adopting a dog is exciting, but preparation is key to a smooth transition. Here is everything you need to have ready.</p><h2>Safety First</h2><ul><li>Remove toxic plants (lilies, aloe vera, sago palm)</li><li>Secure electrical cords and small objects</li><li>Install baby gates if needed</li><li>Check balcony and window safety</li></ul><h2>Essential Supplies</h2><ul><li>Food and water bowls (stainless steel recommended)</li><li>Age-appropriate food</li><li>Collar, leash, and ID tag</li><li>Comfortable bed or crate</li><li>Poop bags and cleaning supplies</li></ul><h2>The First 72 Hours</h2><p>The first three days are crucial. Keep the environment calm and quiet. Let your dog explore at their own pace. Establish a routine for feeding, walks, and bathroom breaks immediately.</p><p>Most importantly, be patient. Your new companion may take days or weeks to fully settle in.</p>',289,'#1a2a1a'],
    ['a2','Why adopt, not shop?','Awareness','🐾','5 min','PawFinder Team','The case for adoption over purchasing from breeders','<h2>The Numbers</h2><p>India has an estimated 62 million stray dogs. Shelters across the country are overwhelmed, and many dogs face euthanasia simply because there are not enough homes.</p><h2>Benefits of Adoption</h2><ul><li>Save a life — every adoption opens a shelter spot for another rescue</li><li>Mixed breeds are often healthier than purebreds</li><li>Adult dogs come with established personalities</li><li>Adoption fees are a fraction of breeder prices</li><li>Many shelter dogs are already vaccinated and neutered</li></ul><h2>Breaking the Stigma</h2><p>Indian indie dogs are incredibly resilient, intelligent, and loyal. They have evolved for our climate and are naturally suited to Indian households.</p>',445,'#2a1a1a'],
    ['a3','Complete vaccination guide for dogs','Health','💉','6 min','Dr. Rajesh Kumar, Veterinarian','Everything you need to know about keeping your dog protected','<h2>Core Vaccines</h2><p>Every dog in India needs these essential vaccines regardless of lifestyle.</p><ul><li><strong>Rabies</strong> — Required by law. First dose at 3 months, annual boosters.</li><li><strong>DHPP</strong> — Distemper, Hepatitis, Parvovirus, Parainfluenza. Series starts at 6-8 weeks.</li></ul><h2>Recommended Vaccines</h2><ul><li>Leptospirosis — especially in areas with flooding</li><li>Bordetella — for dogs that socialize frequently</li><li>Canine Influenza</li></ul><h2>Vaccination Schedule</h2><p>6-8 weeks: First DHPP<br>10-12 weeks: Second DHPP<br>14-16 weeks: Third DHPP + Rabies<br>Annual: Boosters for all core vaccines</p><h2>Cost in Coimbatore</h2><p>Basic vaccination package: Rs 1,500-3,000 per year at most Coimbatore veterinary clinics. Many shelters run free or subsidized vaccination camps across the city.</p>',312,'#1a1a2a'],
    ['a4','Understanding indie dog behavior','Training','🐕','5 min','Meera Sundaram, Canine Behaviorist','A guide to living with Indian street dogs','<h2>Indie Dogs Are Different</h2><p>Indian indie dogs have survived on the streets for generations. This makes them incredibly smart, resourceful, and sometimes cautious around new environments.</p><h2>Common Behaviors</h2><ul><li><strong>Resource guarding</strong> — Street dogs learn to protect food. Be patient and use positive reinforcement.</li><li><strong>Noise sensitivity</strong> — Firecrackers, traffic, and loud sounds may cause anxiety.</li><li><strong>Territorial marking</strong> — Common in newly adopted males. Neutering helps significantly.</li></ul><h2>Building Trust</h2><p>The key to a happy indie dog is patience and consistency. Never use punishment-based training. Positive reinforcement with treats and praise works wonders.</p><p>Most indie dogs form incredibly strong bonds with their families once trust is established.</p>',187,'#2a2a1a'],
    ['a5','Reading your dog body language','Tips','🐾','4 min','Dr. Anitha Rao','Learn to understand what your dog is telling you','<h2>Tail Talk</h2><ul><li>Wagging broadly — Happy and relaxed</li><li>Tucked between legs — Fearful or anxious</li><li>Stiff and high — Alert or potentially aggressive</li><li>Slow wag — Uncertain or cautious</li></ul><h2>Ear Positions</h2><ul><li>Forward — Interested and alert</li><li>Flat against head — Fearful or submissive</li><li>Relaxed to sides — Calm and content</li></ul><h2>Body Postures</h2><ul><li>Play bow (front down, rear up) — Invitation to play!</li><li>Rolling over — Trust or submission</li><li>Whale eye (showing whites) — Uncomfortable, give space</li></ul><p>Learning these signals will transform your relationship with your dog and help prevent misunderstandings.</p>',156,'#1a2a2a'],
    ['a6','India stray dog crisis: 62 million animals','Awareness','🇮🇳','7 min','PawFinder Research Team','The numbers behind the problem and what individuals can do','<h2>The Scale of the Problem</h2><p>India is home to approximately 62 million stray dogs, the largest free-roaming dog population in the world. This number continues to grow despite government sterilization programs.</p><h2>Why So Many?</h2><ul><li>Irresponsible breeding and puppy mills</li><li>Abandonment of purchased dogs</li><li>Insufficient sterilization coverage</li><li>Open garbage disposal attracting strays</li></ul><h2>The Solution</h2><p>The Animal Birth Control (ABC) program mandates humane sterilization of strays. But coverage remains low in most cities.</p><h2>What You Can Do</h2><ul><li>Adopt, do not shop</li><li>Support local shelters financially</li><li>Volunteer your time</li><li>Report injured animals to rescue helplines</li><li>Feed community dogs responsibly</li><li>Spread awareness in your neighborhood</li></ul>',631,'#2a1a2a'],
    ['a7','Dog nutrition basics for Indian households','Nutrition','🍚','5 min','Dr. Kavitha Raman, Veterinary Nutritionist','What to feed your dog — the Indian edition','<h2>Commercial vs Home Food</h2><p>Both can work well for your dog if done correctly. Many Indian dog owners successfully feed a combination of both.</p><h2>Safe Indian Foods for Dogs</h2><ul><li>Boiled rice with chicken or fish (boneless)</li><li>Boiled eggs</li><li>Curd (plain, small amounts)</li><li>Boiled vegetables (carrots, beans, pumpkin)</li><li>Ragi porridge</li></ul><h2>Foods to Avoid</h2><ul><li>Onions, garlic, grapes, raisins — toxic!</li><li>Chocolate and caffeine</li><li>Spicy food and masala</li><li>Cooked bones (can splinter)</li><li>Excessive salt</li></ul><h2>Feeding Schedule</h2><p>Adults: 2 meals per day<br>Puppies (under 6 months): 3-4 meals per day<br>Seniors: 2 smaller meals, easy to digest</p>',203,'#2a2a1a'],
    ['a8','Monsoon care for your dog','Health','☔','4 min','Dr. Priya Sharma','Keep your furry friend safe during the rainy season','<h2>Health Risks During Monsoon</h2><ul><li>Tick and flea infestations increase dramatically</li><li>Fungal infections from damp fur</li><li>Leptospirosis from contaminated water</li><li>Digestive issues from street puddle water</li></ul><h2>Prevention Tips</h2><ul><li>Dry your dog thoroughly after walks</li><li>Use anti-tick/flea treatments regularly</li><li>Keep their sleeping area dry and clean</li><li>Avoid walks during heavy rain</li><li>Check paws for infections after outdoor time</li></ul><h2>Emergency Kit</h2><p>Keep a monsoon kit ready: towels, antiseptic solution, anti-fungal powder, tick removal tool, and your vet emergency number.</p>',167,'#1a2a3a'],
    ['a9','Positive reinforcement training 101','Training','🧠','6 min','Meera Sundaram, Canine Behaviorist','The science-backed way to train your dog','<h2>Why Positive Reinforcement?</h2><p>Studies consistently show that reward-based training is more effective and creates a stronger bond than punishment-based methods.</p><h2>Basic Commands</h2><ul><li><strong>Sit</strong> — Hold treat above nose, move back. Dog sits naturally. Reward immediately.</li><li><strong>Stay</strong> — Start with 2 seconds, gradually increase. Always release with a cue word.</li><li><strong>Come</strong> — Use an excited voice. Reward generously when they arrive.</li><li><strong>Leave it</strong> — Essential for street safety in India.</li></ul><h2>Training Tips</h2><ul><li>Keep sessions short: 5-10 minutes</li><li>Train before meals when motivation is high</li><li>Be consistent with cue words</li><li>End on a positive note</li></ul>',278,'#2a1a3a'],
    ['a10','The joy of senior dog adoption','Story','🐾','4 min','PawFinder Community','Why older dogs make the best companions','<h2>Senior Dogs Need Love Too</h2><p>Puppies get all the attention, but senior dogs (7+ years) often wait the longest in shelters. They are the most overlooked and the most deserving.</p><h2>Benefits of Adopting a Senior</h2><ul><li>Personality is fully developed — no surprises</li><li>Usually house-trained and calm</li><li>Lower energy means less exercise demands</li><li>They are incredibly grateful and bond deeply</li><li>Perfect for seniors and working professionals</li></ul><p>Give a senior dog their best final chapter. The love they return is beyond measure.</p>',198,'#1a2a1a'],
    ['a11','Beating the Coimbatore summer: heat care for dogs','Health','🌡️','5 min','Dr. Rajesh Kumar, Veterinarian','How to keep your dog safe through Kovai summers','<h2>Coimbatore Gets Hot</h2><p>Summer temperatures in Coimbatore regularly cross 38°C. Dogs cool themselves mainly by panting, and heatstroke can set in fast — especially for thick-coated and senior dogs.</p><h2>Warning Signs of Heatstroke</h2><ul><li>Excessive panting and drooling</li><li>Bright red gums and tongue</li><li>Wobbliness or collapse</li><li>Vomiting or diarrhoea</li></ul><h2>Prevention</h2><ul><li>Walk only before 7 AM or after 6:30 PM</li><li>Check pavement with your hand — if it is too hot for you, it burns paws</li><li>Always keep fresh water available, add ice on peak days</li><li>Never leave a dog in a parked vehicle</li><li>Provide a shaded, ventilated resting spot</li></ul><h2>Emergency</h2><p>If you suspect heatstroke, move the dog to shade, wet them with cool (not ice-cold) water, and rush to the nearest Coimbatore vet immediately.</p>',241,'#2a1a1a'],
    ['a12','A Coimbatore guide to your first vet visit','Health','🩺','5 min','Dr. Anitha Rao','What to expect and how to prepare in Kovai','<h2>Booking the Visit</h2><p>Schedule your new dog\'s first check-up within 3-5 days of adoption. Most Coimbatore shelters can recommend a trusted partner clinic.</p><h2>What to Carry</h2><ul><li>Any vaccination or medical records from the shelter</li><li>A fresh stool sample (for deworming check)</li><li>A sturdy leash or carrier</li><li>Treats to keep the visit positive</li></ul><h2>What the Vet Will Do</h2><ul><li>Full physical examination</li><li>Weight and body-condition check</li><li>Vaccination and deworming plan</li><li>Spay/neuter discussion if not already done</li><li>Tick and flea prevention advice (important in Coimbatore)</li></ul><h2>Build a Relationship</h2><p>Pick a clinic close to home for emergencies. Keep their number and the 24/7 rescue helpline saved on your phone.</p>',176,'#1a1a2a'],
    ['a13','Adopting in an apartment: making it work','Tips','🏢','4 min','PawFinder Team','Yes, you can give a rescue a great life in a flat','<h2>Apartment Dogs Thrive With Routine</h2><p>Plenty of Coimbatore adopters live in apartments and raise wonderfully happy dogs. Size matters far less than exercise and companionship.</p><h2>Set Up for Success</h2><ul><li>Pick a calm corner for the dog\'s bed</li><li>Use a consistent potty schedule (4-5 walks for young dogs)</li><li>Provide chew toys and enrichment for alone time</li><li>Inform your landlord and neighbours early</li></ul><h2>Best Apartment Matches</h2><p>Calm adults and seniors often adapt fastest. Ask the shelter for dogs described as low-to-medium energy and apartment-friendly.</p>',149,'#1a2a2a'],
    ['a14','From street to sofa: Bruno\'s story','Story','💛','3 min','PawFinder Community','One construction-site rescue, one forever family','<h2>Found at a Building Site</h2><p>Bruno was a frightened, dusty puppy hiding behind cement bags near R.S. Puram. A volunteer coaxed him out with a biscuit and a lot of patience.</p><h2>The Turnaround</h2><p>After vaccinations, deworming and three months of gentle socialisation, Bruno blossomed into a confident, affectionate dog who greets every visitor like an old friend.</p><h2>Home at Last</h2><p>The Sharma family adopted Bruno in early 2024. "He settled within three days," they wrote. "Best decision we ever made." Bruno\'s story is proof that the right home changes everything.</p>',221,'#2a2a1a'],
    ['a15','Spaying and neutering: myths vs facts','Awareness','♻️','5 min','Dr. Kavitha Raman, Veterinary Nutritionist','Why sterilisation is the kindest choice','<h2>Why It Matters</h2><p>Sterilisation is the single most effective way to reduce the stray population humanely. One unspayed female and her offspring can lead to thousands of dogs in a few years.</p><h2>Common Myths</h2><ul><li><strong>"It changes their personality"</strong> — It does not. Dogs stay themselves, often calmer.</li><li><strong>"A female should have one litter first"</strong> — No medical basis; early spaying lowers cancer risk.</li><li><strong>"It is unsafe"</strong> — It is a routine, low-risk procedure done daily across Coimbatore.</li></ul><h2>Health Benefits</h2><ul><li>Lower risk of mammary and testicular cancers</li><li>Reduced roaming, marking and aggression</li><li>Longer average lifespan</li></ul>',188,'#2a1a2a'],
    ['a16','Body condition: is your dog the right weight?','Nutrition','⚖️','4 min','Dr. Kavitha Raman, Veterinary Nutritionist','A simple at-home check every owner should know','<h2>The Hands-On Test</h2><ul><li><strong>Ribs</strong> — You should feel them easily with light pressure, like the back of your hand</li><li><strong>Waist</strong> — Looking from above, there should be a visible tuck behind the ribs</li><li><strong>Profile</strong> — From the side, the belly should tuck up, not sag</li></ul><h2>Overweight Risks</h2><p>Excess weight strains joints and the heart and shortens lifespan. It is one of the most common, most preventable health issues in pet dogs.</p><h2>Getting It Right</h2><ul><li>Measure meals — do not free-feed</li><li>Count treats as part of daily calories</li><li>Adjust portions for age and activity</li><li>Re-check body condition monthly</li></ul>',134,'#2a2a1a'],
    ['a17','First week with your rescue: a day-by-day plan','Tips','📅','6 min','Meera Sundaram, Canine Behaviorist','The 3-3-3 rule for a calm transition','<h2>The 3-3-3 Rule</h2><p>Rescue dogs typically need 3 days to decompress, 3 weeks to learn your routine, and 3 months to truly feel at home.</p><h2>Days 1-3: Decompress</h2><ul><li>Keep things quiet — no parties or big outings</li><li>Limit the dog to one or two rooms</li><li>Let them approach you; do not overwhelm with affection</li></ul><h2>Week 1: Routine</h2><ul><li>Fixed feeding and walk times build security</li><li>Start gentle, short positive training sessions</li><li>Introduce family members calmly, one at a time</li></ul><h2>Watch and Learn</h2><p>Note what scares or excites your dog. Early patience prevents long-term behaviour problems and builds lifelong trust.</p>',207,'#1a2a3a'],
    ['a18','How the PawFinder adoption process works','Awareness','📋','4 min','PawFinder Team','From application to adoption day, step by step','<h2>1. Apply Online</h2><p>Browse dogs, open a profile, and submit the adoption application with your home details and the required documents.</p><h2>2. Shelter Review (within 48 hours)</h2><p>The shelter reviews your application and uploaded documents — government ID, address proof, income proof and home photos.</p><h2>3. Home Visit</h2><p>A volunteer schedules a short visit or video call to make sure the home is a good fit for the specific dog.</p><h2>4. Approval & Paperwork</h2><p>On approval you complete the adoption agreement. Your documents stay on file with the shelter for follow-up support.</p><h2>5. Meet & Adoption Day</h2><p>You meet your new companion, get care guidance, and take them home. PawFinder support continues after adoption. 🎉</p>',263,'#2a1a2a'],
    ['a19','What documents you need to adopt','Awareness','🪪','4 min','PawFinder Team','The paperwork checklist before you apply','<h2>Why Documents Matter</h2><p>Responsible shelters verify every adopter to make sure each dog goes to a safe, stable home. Having your documents ready makes approval fast and smooth.</p><h2>The Checklist</h2><ul><li><strong>Government ID</strong> — Aadhaar, Voter ID or Passport to confirm your identity</li><li><strong>Address proof</strong> — a recent utility bill or rental agreement</li><li><strong>Income proof</strong> — a salary slip or bank statement showing you can support a dog</li><li><strong>Home photos</strong> — 3-5 clear photos of your living space, including any balcony or yard</li></ul><h2>How It Is Handled</h2><p>In PawFinder you upload these securely during the application. Only the reviewing shelter and admin can view them, and they remain on file after approval for follow-up support and re-homing safety. Accepted formats: JPG, PNG or PDF, up to 8 MB each.</p>',172,'#1a2a2a'],
    ['a20','Introducing your new dog to other pets','Training','🐾','5 min','Meera Sundaram, Canine Behaviorist','Slow, safe introductions that actually work','<h2>Go Slow</h2><p>First impressions matter. Rushing introductions is the most common cause of long-term conflict between pets.</p><h2>Dog to Dog</h2><ul><li>Meet on neutral ground, not at home</li><li>Parallel-walk at a distance, then gradually close the gap</li><li>Keep leashes loose to avoid tension signals</li><li>Watch body language; end on a calm note</li></ul><h2>Dog to Cat</h2><ul><li>Separate them first; swap scents using bedding</li><li>Use a baby gate for controlled visual contact</li><li>Always give the cat an escape route and high perches</li></ul><h2>Patience Wins</h2><p>Full acceptance can take weeks. Reward calm behaviour and never force interactions.</p>',158,'#2a1a3a'],
    ['a21','Decoding dog barking and vocalisations','Training','🔊','4 min','Dr. Anitha Rao','What your dog is really trying to say','<h2>Barking Has Meaning</h2><p>Dogs bark to communicate, not to annoy. Identifying the cause is the first step to managing it.</p><h2>Common Types</h2><ul><li><strong>Alarm barking</strong> — sharp, repetitive at a trigger</li><li><strong>Demand barking</strong> — short bursts aimed at you for attention</li><li><strong>Boredom barking</strong> — monotonous, often when alone</li><li><strong>Fear barking</strong> — high-pitched with a tucked posture</li></ul><h2>What Helps</h2><ul><li>Meet exercise and enrichment needs first</li><li>Never reward demand barking with attention</li><li>Desensitise gradually to alarm triggers</li><li>Reward calm, quiet moments generously</li></ul>',141,'#1a1a2a'],
    ['a22','Adopting a dog with kids at home','Tips','👶','5 min','Dr. Priya Sharma','Raising children and rescues together, safely','<h2>Pick the Right Match</h2><p>Energy and temperament matter more than breed. Ask the shelter which dogs are described as kid-friendly and patient.</p><h2>Teach Kids the Rules</h2><ul><li>Never disturb a dog while eating or sleeping</li><li>No hugging around the neck or pulling ears/tail</li><li>Let the dog come to them, not the other way around</li><li>Always supervise interactions with young children</li></ul><h2>Set the Dog Up to Succeed</h2><ul><li>Create a quiet, child-free safe zone for the dog</li><li>Involve kids in feeding and gentle training</li><li>Watch for stress signals: lip-licking, yawning, whale eye</li></ul><h2>Build a Lifelong Bond</h2><p>With supervision and respect, the friendship between a child and a rescued dog is one of childhood\'s greatest gifts.</p>',176,'#2a2a1a'],
    ['a23','Travelling around Coimbatore with your dog','Tips','🚗','4 min','PawFinder Team','Safe, stress-free trips across Kovai','<h2>Car Safety</h2><ul><li>Use a crash-tested harness or a secured crate</li><li>Never let your dog hang out of the window</li><li>Take breaks on longer drives to the Nilgiris</li><li>Never leave a dog in a parked car in Coimbatore heat</li></ul><h2>Beat the Heat</h2><p>Carry water and a collapsible bowl. Travel early morning or evening when Kovai temperatures are kinder to paws.</p><h2>Dog-Friendly Spots</h2><p>Many open grounds and parks around Race Course and the city outskirts welcome leashed dogs. Always carry poop bags and clean up.</p><h2>Vet on the Go</h2><p>Save a 24/7 Coimbatore vet number before any trip, and keep your dog\'s vaccination record handy.</p>',129,'#1a2a3a'],
    ['a24','Caring for a senior dog','Health','🦴','5 min','Dr. Rajesh Kumar, Veterinarian','Helping your old friend age comfortably','<h2>Senior Starts Around 7</h2><p>Larger dogs age faster. Watch for slowing down, stiffness, cloudy eyes and changes in appetite or thirst.</p><h2>Comfort Adjustments</h2><ul><li>Orthopaedic bedding for aching joints</li><li>Non-slip mats on smooth floors</li><li>Shorter, more frequent gentle walks</li><li>Easy access to food, water and resting spots</li></ul><h2>Health Monitoring</h2><ul><li>Twice-yearly vet check-ups</li><li>Senior diet to manage weight and joints</li><li>Dental care to prevent painful infections</li><li>Watch for lumps, limping or behaviour changes</li></ul><h2>They Still Need You</h2><p>Senior dogs give back calm, devoted companionship. Their later years can be the most tender of all.</p>',163,'#2a1a1a'],
    ['a25','From foster to forever: Mango\'s journey','Story','💛','3 min','PawFinder Community','How one foster home changed everything','<h2>A Rough Start</h2><p>Mango came into the Humane Animal Society after surgery, frightened and unable to settle in a busy shelter ward.</p><h2>The Foster Difference</h2><p>A volunteer family took Mango in for a few weeks of quiet healing. Away from kennel stress, he recovered faster and rediscovered his playful side.</p><h2>Forever, Unexpectedly</h2><p>Like 78% of our foster parents, the family could not say goodbye. Mango never went back — he was already home. Fostering saves lives, and sometimes it finds you a best friend.</p>',211,'#1a2a1a'],
    ['a26','Recognising a pet emergency','Health','🚑','5 min','Dr. Kavitha Raman, Veterinary Nutritionist','Know the red flags and act fast','<h2>Call a Vet Immediately If You See</h2><ul><li>Difficulty breathing or blue/pale gums</li><li>Repeated vomiting or bloody diarrhoea</li><li>A swollen, hard abdomen (possible bloat)</li><li>Collapse, seizures or sudden inability to stand</li><li>Suspected poisoning (chocolate, rat bait, onions)</li><li>Heavy bleeding or a hit-by-vehicle injury</li></ul><h2>While You Get Help</h2><ul><li>Stay calm; keep the dog warm and still</li><li>Muzzle gently only if a calm dog may bite from pain</li><li>Do not give human medicines</li><li>Call ahead so the clinic is ready</li></ul><h2>Be Prepared</h2><p>Keep a Coimbatore 24/7 vet number and the rescue helpline saved, plus a basic first-aid kit at home.</p>',184,'#2a1a1a']
  ];

  const articleStmt = db.prepare(`INSERT OR IGNORE INTO articles (id,title,category,emoji,read_time,author,summary,content,likes,bg_color) VALUES (?,?,?,?,?,?,?,?,?,?)`);
  for (const a of articles) articleStmt.run(...a);

  const fosterDogs = [
    ['f1','Mango','🐕','Indie','2 yrs','Post-surgery recovery — needs quiet home for healing','3-4 weeks','high','s1'],
    ['f2','Cookie','🐶','Indie Puppy','3 mo','Too young for shelter — needs bottle feeding','6-8 weeks','high','s2'],
    ['f3','Raja','🦮','GSD Mix','5 yrs','Shelter overflow — excellent temperament','4-6 weeks','medium','s3'],
    ['f4','Lily','🐩','Spitz Mix','3 yrs','Nursing mother with 4 puppies','8 weeks','high','s4'],
    ['f5','Goldie','🐕‍🦺','Lab Mix','6 yrs','Behavioral rehab — needs experienced foster','6-8 weeks','medium','s5'],
    ['f6','Patches','🐶','Indie','7 mo','Recovering from skin treatment','3-4 weeks','low','s6'],
    ['f7','Coffee','🐕','Indie','4 yrs','Shy dog needing socialisation in a calm home','5-6 weeks','medium','s7'],
    ['f8','Dottie','🐶','Indie Puppy','2 mo','Orphaned litter — round-the-clock care','7-9 weeks','high','s9']
  ];

  const fosterStmt = db.prepare(`INSERT OR IGNORE INTO foster_dogs (id,name,emoji,breed,age_text,reason,duration,urgency,shelter_id) VALUES (?,?,?,?,?,?,?,?,?)`);
  for (const f of fosterDogs) fosterStmt.run(...f);

  const roles = [
    ['r1','Dog Walker','🚶','Walk shelter dogs on weekends. 2-hour shifts.','#1a2a1a','open','12 spots'],
    ['r2','Feeding Volunteer','🍚','Help prepare and serve meals. Morning shifts.','#2a2a1a','open','8 spots'],
    ['r3','Adoption Counselor','💬','Guide potential adopters through the process.','#1a1a2a','limited','3 spots'],
    ['r4','Medical Assistant','💊','Assist vets during check-ups and treatments.','#2a1a1a','limited','2 spots'],
    ['r5','Photography','📸','Take adoption photos of dogs for the website.','#1a2a2a','open','5 spots'],
    ['r6','Transport','🚗','Help transport dogs to vet visits and adoption events.','#2a1a2a','full','Full']
  ];

  const roleStmt = db.prepare(`INSERT OR IGNORE INTO volunteer_roles (id,title,emoji,description,bg_color,spots_status,spots_text) VALUES (?,?,?,?,?,?,?)`);
  for (const r of roles) roleStmt.run(...r);

  const events = [
    ['e1','Weekend Adoption Drive','Meet adoptable dogs at Brookefields Mall, Coimbatore. Bring your family!','SAT, MAY 24',45,100],
    ['e2','Vaccination Camp','Free vaccination camp at Humane Animal Society, Saibaba Colony. Bring strays from your area.','SUN, MAY 25',28,50],
    ['e3','Dog Training Workshop','Learn basic training techniques from certified behaviorists at Race Course grounds.','SAT, MAY 31',32,40]
  ];

  const eventStmt = db.prepare(`INSERT OR IGNORE INTO volunteer_events (id,title,description,event_date,attendees,max_attendees) VALUES (?,?,?,?,?,?)`);
  for (const e of events) eventStmt.run(...e);
}

module.exports = { getDb, initializeDatabase };

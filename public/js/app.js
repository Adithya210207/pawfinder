// ═══════════════════════════════════════════════════════════════
// PawFinder — Frontend Application
// ═══════════════════════════════════════════════════════════════

// Complete Application Dataset (52 Dogs, 20 Shelters, 18 Articles, User & Notifications)
const MOCK_DATA = {
  user: { id: 'demo-user', name: 'Adithya Kumar', email: 'demo@pawfinder.in', phone: '+91 9876543210', city: 'Coimbatore', avatar_initials: 'AK', paw_points: 240, is_admin: 1 },
  notifications: [
    { id: 'n1', title: 'Welcome to PawFinder! 🐾', body: 'Start by browsing dogs available for adoption across Coimbatore.', read: 0, created_at: 'Just now' },
    { id: 'n2', title: 'Bruno is waiting for you!', body: 'You viewed Bruno earlier. He is still available for adoption in R.S. Puram, Coimbatore.', read: 0, created_at: '2 hours ago' },
    { id: 'n3', title: 'New dogs added near you', body: 'Fresh rescues were added across Coimbatore shelters this week.', read: 1, created_at: 'Yesterday' }
  ],
  shelters: [
    { id: 's1', name: 'Humane Animal Society', emoji: '🏥', address: 'Saibaba Colony, Coimbatore', city: 'Coimbatore', phone: '+91 422 244 5678', email: 'care@haskovai.org', hours: '9AM-5PM', distance_km: 2.1, dogs_available: 52, dogs_rehomed: 384, volunteers: 92, rating: 4.9, verified: 1, tags: ['Verified', 'No-Kill', 'Since 1996'] },
    { id: 's2', name: 'Kongu Animal Rescue', emoji: '🐾', address: 'Gandhipuram, Coimbatore', city: 'Coimbatore', phone: '+91 422 249 1089', email: 'help@konguanimalrescue.org', hours: '8AM-6PM', distance_km: 3.4, dogs_available: 41, dogs_rehomed: 219, volunteers: 58, rating: 4.7, verified: 1, tags: ['Verified', 'Rescue', 'Rehab'] },
    { id: 's3', name: 'Blue Cross of Coimbatore', emoji: '🏠', address: 'R.S. Puram, Coimbatore', city: 'Coimbatore', phone: '+91 422 247 2345', email: 'info@bluecrosskovai.org', hours: '9AM-4PM', distance_km: 1.8, dogs_available: 37, dogs_rehomed: 198, volunteers: 44, rating: 4.6, verified: 1, tags: ['Verified', 'Adoption', 'Medical'] },
    { id: 's4', name: 'Paws & Care Kovai', emoji: '💚', address: 'Peelamedu, Coimbatore', city: 'Coimbatore', phone: '+91 422 257 5566', email: 'hello@pawscarekovai.org', hours: '10AM-6PM', distance_km: 5.6, dogs_available: 33, dogs_rehomed: 142, volunteers: 49, rating: 4.5, verified: 1, tags: ['Rescue', 'Foster', 'Education'] },
    { id: 's5', name: 'Street Dog Care Coimbatore', emoji: '🐕', address: 'Race Course, Coimbatore', city: 'Coimbatore', phone: '+91 422 231 3344', email: 'sdc@coimbatore.org', hours: '8AM-5PM', distance_km: 3.0, dogs_available: 29, dogs_rehomed: 121, volunteers: 36, rating: 4.5, verified: 1, tags: ['Verified', 'Sterilization', 'Feeding'] },
    { id: 's6', name: 'Second Chance Kovai', emoji: '🌟', address: 'Saravanampatti, Coimbatore', city: 'Coimbatore', phone: '+91 422 266 8877', email: 'team@secondchancekovai.org', hours: '9AM-5PM', distance_km: 7.9, dogs_available: 24, dogs_rehomed: 88, volunteers: 21, rating: 4.3, verified: 1, tags: ['Foster', 'Special Needs'] },
    { id: 's7', name: 'Nilgiris Foothills Rescue', emoji: '⛰️', address: 'Mettupalayam Road, Coimbatore', city: 'Coimbatore', phone: '+91 422 268 4422', email: 'rescue@nilgirisfoothills.org', hours: '9AM-5PM', distance_km: 12.4, dogs_available: 27, dogs_rehomed: 73, volunteers: 19, rating: 4.4, verified: 1, tags: ['Verified', 'Rescue', 'Hill-region'] },
    { id: 's8', name: 'Vadavalli Animal Trust', emoji: '🐶', address: 'Vadavalli, Coimbatore', city: 'Coimbatore', phone: '+91 422 242 9911', email: 'trust@vadavallianimals.org', hours: '8AM-4PM', distance_km: 6.2, dogs_available: 22, dogs_rehomed: 64, volunteers: 17, rating: 4.2, verified: 1, tags: ['Adoption', 'Community'] },
    { id: 's9', name: 'Kovai Pet Sanctuary', emoji: '🦴', address: 'Kuniyamuthur, Coimbatore', city: 'Coimbatore', phone: '+91 422 260 7788', email: 'sanctuary@kovaipets.org', hours: '9AM-6PM', distance_km: 8.8, dogs_available: 19, dogs_rehomed: 57, volunteers: 14, rating: 4.1, verified: 1, tags: ['Sanctuary', 'Senior dogs'] },
    { id: 's10', name: 'Pollachi Paws Foundation', emoji: '🐾', address: 'Pollachi Main Road, Coimbatore', city: 'Coimbatore', phone: '+91 4259 22 3344', email: 'paws@pollachifoundation.org', hours: '8AM-5PM', distance_km: 38.0, dogs_available: 18, dogs_rehomed: 49, volunteers: 12, rating: 4.0, verified: 1, tags: ['Rural rescue', 'Verified'] },
    { id: 's11', name: 'Annur Animal Aid', emoji: '💙', address: 'Annur, Coimbatore', city: 'Coimbatore', phone: '+91 4254 23 1122', email: 'aid@annuranimals.org', hours: '9AM-4PM', distance_km: 28.5, dogs_available: 14, dogs_rehomed: 41, volunteers: 9, rating: 3.9, verified: 0, tags: ['Rural rescue', 'Community'] },
    { id: 's12', name: 'Sulur Rescue Collective', emoji: '🤝', address: 'Sulur, Coimbatore', city: 'Coimbatore', phone: '+91 422 268 9090', email: 'collective@sulurrescue.org', hours: '9AM-5PM', distance_km: 18.7, dogs_available: 16, dogs_rehomed: 38, volunteers: 11, rating: 4.1, verified: 1, tags: ['Rescue', 'Foster'] },
    { id: 's13', name: 'Coimbatore Animal Welfare Trust', emoji: '🏥', address: 'Ramanathapuram, Coimbatore', city: 'Coimbatore', phone: '+91 422 232 7766', email: 'cawt@kovaiwelfare.org', hours: '9AM-5PM', distance_km: 4.2, dogs_available: 38, dogs_rehomed: 176, volunteers: 47, rating: 4.7, verified: 1, tags: ['Verified', 'No-Kill', 'Medical'] },
    { id: 's14', name: 'Tail Waggers Rescue', emoji: '🐕', address: 'Singanallur, Coimbatore', city: 'Coimbatore', phone: '+91 422 258 4433', email: 'hello@tailwaggerskovai.org', hours: '8AM-6PM', distance_km: 5.1, dogs_available: 31, dogs_rehomed: 134, volunteers: 38, rating: 4.6, verified: 1, tags: ['Verified', 'Adoption', 'Foster'] },
    { id: 's15', name: 'Kovai Compassion Home', emoji: '💚', address: 'Thudiyalur, Coimbatore', city: 'Coimbatore', phone: '+91 422 264 5511', email: 'care@kovaicompassion.org', hours: '9AM-5PM', distance_km: 9.3, dogs_available: 26, dogs_rehomed: 97, volunteers: 28, rating: 4.4, verified: 1, tags: ['Sanctuary', 'Special Needs'] },
    { id: 's16', name: 'Ganesh Animal Shelter', emoji: '🐾', address: 'Ondipudur, Coimbatore', city: 'Coimbatore', phone: '+91 422 257 8822', email: 'shelter@ganeshanimals.org', hours: '8AM-5PM', distance_km: 7.4, dogs_available: 23, dogs_rehomed: 81, volunteers: 22, rating: 4.3, verified: 1, tags: ['Rescue', 'Community', 'Feeding'] },
    { id: 's17', name: 'Kovai Indie Care', emoji: '🐶', address: 'Ganapathy, Coimbatore', city: 'Coimbatore', phone: '+91 422 233 9090', email: 'indie@kovaicare.org', hours: '9AM-6PM', distance_km: 3.7, dogs_available: 35, dogs_rehomed: 112, volunteers: 33, rating: 4.6, verified: 1, tags: ['Verified', 'Indie-focus', 'Sterilization'] },
    { id: 's18', name: 'Western Ghats Animal Refuge', emoji: '⛰️', address: 'Thondamuthur, Coimbatore', city: 'Coimbatore', phone: '+91 422 245 1212', email: 'refuge@westernghatsanimals.org', hours: '9AM-4PM', distance_km: 16.8, dogs_available: 21, dogs_rehomed: 64, volunteers: 18, rating: 4.2, verified: 1, tags: ['Verified', 'Rescue', 'Hill-region'] },
    { id: 's19', name: 'Karumathampatti Animal Aid', emoji: '🤝', address: 'Karumathampatti, Coimbatore', city: 'Coimbatore', phone: '+91 4257 22 4545', email: 'aid@karumathampatti.org', hours: '9AM-5PM', distance_km: 22.4, dogs_available: 17, dogs_rehomed: 43, volunteers: 12, rating: 4.0, verified: 0, tags: ['Rural rescue', 'Community'] },
    { id: 's20', name: 'Madukkarai Street Animal Project', emoji: '🌟', address: 'Madukkarai, Coimbatore', city: 'Coimbatore', phone: '+91 422 264 3377', email: 'team@madukkaraistreet.org', hours: '8AM-5PM', distance_km: 14.1, dogs_available: 19, dogs_rehomed: 56, volunteers: 15, rating: 4.1, verified: 1, tags: ['Sterilization', 'Feeding', 'Verified'] }
  ],
  dogs: [
    { id: 'dog-1', name: 'Bruno', breed: 'Labrador Mix', age_text: '2 yrs', gender: 'Male', weight_kg: 18, size: 'Medium', emoji: '🐕', location: 'R.S. Puram, Coimbatore', shelter_id: 's3', shelter_name: 'Blue Cross of Coimbatore', about: 'Bruno was rescued from a construction site near R.S. Puram as a puppy. He has since transformed into the most lovable, well-mannered companion. House-trained, leash-trained, and incredibly gentle with children.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Kids,Cats,Dogs', energy_level: 'High', exercise: '2 walks per day (30 min each)', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Dry kibble, 2x daily', traits: 'Playful,Loyal,Gentle,Smart', urgent: 0, featured: 1 },
    { id: 'dog-2', name: 'Bella', breed: 'Indie', age_text: '1 yr', gender: 'Female', weight_kg: 12, size: 'Medium', emoji: '🐕‍🦺', location: 'Gandhipuram, Coimbatore', shelter_id: 's2', shelter_name: 'Kongu Animal Rescue', about: 'Bella is a sweet indie girl rescued from the busy streets of Gandhipuram. She is shy at first but warms up quickly. Perfect for a quiet household.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Dogs', energy_level: 'Medium', exercise: '1-2 walks per day', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Home food or kibble', traits: 'Shy,Sweet,Calm,Affectionate', urgent: 0, featured: 0 },
    { id: 'dog-3', name: 'Rocky', breed: 'GSD Mix', age_text: '3 yrs', gender: 'Male', weight_kg: 25, size: 'Large', emoji: '🦮', location: 'Saibaba Colony, Coimbatore', shelter_id: 's1', shelter_name: 'Humane Animal Society', about: 'Rocky is a German Shepherd mix with incredible loyalty. Previously a guard dog at a Saibaba Colony warehouse, he now seeks a loving family. Well-trained and protective.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Older kids', energy_level: 'High', exercise: '2-3 walks per day', grooming: 'Regular brushing needed', space: 'House with yard preferred', diet: 'Premium kibble, 2x daily', traits: 'Protective,Loyal,Alert,Brave', urgent: 0, featured: 0 },
    { id: 'dog-4', name: 'Luna', breed: 'Indie', age_text: '8 mo', gender: 'Female', weight_kg: 8, size: 'Small', emoji: '🐶', location: 'Race Course, Coimbatore', shelter_id: 's5', shelter_name: 'Street Dog Care Coimbatore', about: 'Luna is an adorable puppy found near Race Course road. Full of energy and love. She needs a family who can give her time and training.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Very High', exercise: 'Multiple walks + playtime', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy food, 3x daily', traits: 'Energetic,Curious,Friendly,Playful', urgent: 0, featured: 0 },
    { id: 'dog-5', name: 'Max', breed: 'Labrador', age_text: '4 yrs', gender: 'Male', weight_kg: 28, size: 'Large', emoji: '🐕', location: 'Peelamedu, Coimbatore', shelter_id: 's4', shelter_name: 'Paws & Care Kovai', about: 'Max is a purebred Labrador surrendered by his family due to relocation from Peelamedu. He is house-trained, knows commands, and is great with children.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Moderate shedding', space: 'House preferred', diet: 'Kibble + rice, 2x daily', traits: 'Obedient,Gentle,Calm,Trained', urgent: 0, featured: 0 },
    { id: 'dog-6', name: 'Charlie', breed: 'Indie', age_text: '7 yrs', gender: 'Male', weight_kg: 15, size: 'Medium', emoji: '🐕', location: 'Gandhipuram, Coimbatore', shelter_id: 's2', shelter_name: 'Kongu Animal Rescue', about: 'Charlie is a senior indie boy looking for a quiet retirement home. He is calm, house-trained, and loves belly rubs. Low maintenance companion.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Seniors', energy_level: 'Low', exercise: '1 gentle walk per day', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Soft food + kibble', traits: 'Calm,Gentle,Low-key,Loving', urgent: 1, featured: 0 },
    { id: 'dog-7', name: 'Daisy', breed: 'Pomeranian Mix', age_text: '2 yrs', gender: 'Female', weight_kg: 5, size: 'Small', emoji: '🐩', location: 'Saibaba Colony, Coimbatore', shelter_id: 's1', shelter_name: 'Humane Animal Society', about: 'Daisy is a fluffy Pomeranian mix with a big personality. She loves attention and will follow you everywhere. Great apartment dog.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Older kids', energy_level: 'Medium', exercise: 'Short walks + indoor play', grooming: 'Regular grooming needed', space: 'Apartment-friendly', diet: 'Small breed kibble, 2x daily', traits: 'Sassy,Loyal,Alert,Cuddly', urgent: 0, featured: 0 },
    { id: 'dog-8', name: 'Rex', breed: 'Indie', age_text: '1.5 yrs', gender: 'Male', weight_kg: 20, size: 'Medium', emoji: '🦮', location: 'Saravanampatti, Coimbatore', shelter_id: 's6', shelter_name: 'Second Chance Kovai', about: 'Rex was found injured on the Saravanampatti bypass and nursed back to health. He is now fully recovered and looking for his forever family. Very grateful and loyal.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Dogs', energy_level: 'High', exercise: '2 long walks per day', grooming: 'Low maintenance', space: 'House with yard preferred', diet: 'Rice + chicken, 2x daily', traits: 'Grateful,Energetic,Loyal,Brave', urgent: 0, featured: 0 },
    { id: 'dog-9', name: 'Coco', breed: 'Spitz Mix', age_text: '3 yrs', gender: 'Female', weight_kg: 7, size: 'Small', emoji: '🐩', location: 'R.S. Puram, Coimbatore', shelter_id: 's3', shelter_name: 'Blue Cross of Coimbatore', about: 'Coco is a beautiful Spitz mix who was abandoned near R.S. Puram market. She has a gorgeous white coat and loves to be pampered. Ideal for families.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'Medium', exercise: '1-2 walks + indoor play', grooming: 'Regular grooming', space: 'Apartment-friendly', diet: 'Small breed kibble', traits: 'Elegant,Playful,Social,Sweet', urgent: 0, featured: 0 },
    { id: 'dog-10', name: 'Buddy', breed: 'Indie', age_text: '5 yrs', gender: 'Male', weight_kg: 22, size: 'Large', emoji: '🐕', location: 'Vadavalli, Coimbatore', shelter_id: 's8', shelter_name: 'Vadavalli Animal Trust', about: 'Buddy is a strong, healthy indie who has been at the Vadavalli shelter for over a year. He is well-socialized with other dogs and very obedient.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble + home food', traits: 'Friendly,Obedient,Social,Patient', urgent: 0, featured: 0 },
    { id: 'dog-11', name: 'Tiger', breed: 'Indie', age_text: '9 yrs', gender: 'Male', weight_kg: 18, size: 'Medium', emoji: '🐕', location: 'Saibaba Colony, Coimbatore', shelter_id: 's1', shelter_name: 'Humane Animal Society', about: 'Tiger is a senior boy with the gentlest soul. He has been at the shelter the longest and deserves a warm home for his golden years.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Seniors', energy_level: 'Very Low', exercise: 'Short gentle walks', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Senior diet, 2x daily', traits: 'Gentle,Calm,Wise,Loving', urgent: 1, featured: 0 },
    { id: 'dog-12', name: 'Peanut', breed: 'Pomeranian Mix', age_text: '3 mo', gender: 'Male', weight_kg: 2, size: 'Small', emoji: '🐶', location: 'Peelamedu, Coimbatore', shelter_id: 's4', shelter_name: 'Paws & Care Kovai', about: 'Peanut is the tiniest fluffball you will ever meet! Rescued as a newborn near Peelamedu, bottle-fed by volunteers. He needs a patient, loving home.', vaccinated: 0, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Experienced owners', energy_level: 'Very High', exercise: 'Supervised play', grooming: 'Future grooming needs', space: 'Apartment-friendly', diet: 'Puppy formula + soft food', traits: 'Tiny,Playful,Curious,Needy', urgent: 0, featured: 0 },
    { id: 'dog-13', name: 'Ginger', breed: 'Indie', age_text: '2 yrs', gender: 'Female', weight_kg: 14, size: 'Medium', emoji: '🐕‍🦺', location: 'Singanallur, Coimbatore', shelter_id: 's14', shelter_name: 'Tail Waggers Rescue', about: 'Ginger is a beautiful brown indie with expressive eyes. She was rescued from the Singanallur lake area and has been waiting for a family since.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Low maintenance', space: 'Any home', diet: 'Home food or kibble', traits: 'Expressive,Sweet,Resilient,Calm', urgent: 0, featured: 0 },
    { id: 'dog-14', name: 'Shadow', breed: 'Doberman Mix', age_text: '4 yrs', gender: 'Male', weight_kg: 30, size: 'Large', emoji: '🦮', location: 'Saravanampatti, Coimbatore', shelter_id: 's6', shelter_name: 'Second Chance Kovai', about: 'Shadow is a majestic Doberman mix with a gentle heart. Despite his size, he is incredibly gentle and well-trained.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Experienced owners', energy_level: 'High', exercise: 'Long runs or walks', grooming: 'Regular grooming', space: 'House with yard', diet: 'High protein kibble', traits: 'Majestic,Gentle,Protective,Smart', urgent: 0, featured: 0 },
    { id: 'dog-15', name: 'Nila', breed: 'Indie', age_text: '1 yr', gender: 'Female', weight_kg: 10, size: 'Medium', emoji: '🐕‍🦺', location: 'Kuniyamuthur, Coimbatore', shelter_id: 's9', shelter_name: 'Kovai Pet Sanctuary', about: 'Nila (meaning moon) is a beautiful white indie girl rescued near Kuniyamuthur. She is incredibly social and great with other dogs.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'High', exercise: 'Long walks preferred', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble + fish', traits: 'Social,Active,Friendly,Gentle', urgent: 0, featured: 0 },
    { id: 'dog-16', name: 'Simba', breed: 'Indie', age_text: '8 yrs', gender: 'Male', weight_kg: 20, size: 'Medium', emoji: '🐕', location: 'Gandhipuram, Coimbatore', shelter_id: 's2', shelter_name: 'Kongu Animal Rescue', about: 'Simba is a dignified senior who still has lots of love to give. He was a community dog cared for by Gandhipuram shopkeepers until he needed medical attention.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults', energy_level: 'Low', exercise: 'Short walks', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Senior diet', traits: 'Dignified,Calm,Loyal,Gentle', urgent: 1, featured: 0 },
    { id: 'dog-17', name: 'Pepper', breed: 'Indie', age_text: '6 mo', gender: 'Female', weight_kg: 6, size: 'Small', emoji: '🐶', location: 'R.S. Puram, Coimbatore', shelter_id: 's3', shelter_name: 'Blue Cross of Coimbatore', about: 'Pepper is a spunky little puppy with a spotted coat. Found near R.S. Puram temple.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Very High', exercise: 'Lots of playtime!', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy food', traits: 'Spunky,Energetic', urgent: 0, featured: 0 },
    { id: 'dog-18', name: 'Duke', breed: 'Lab Mix', age_text: '5 yrs', gender: 'Male', weight_kg: 26, size: 'Large', emoji: '🐕', location: 'Peelamedu, Coimbatore', shelter_id: 's4', shelter_name: 'Paws & Care Kovai', about: 'Duke is a calm, well-mannered Lab mix who was surrendered when his family relocated.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'Medium', exercise: '1-2 walks per day', grooming: 'Moderate shedding', space: 'House preferred', diet: 'Kibble', traits: 'Calm,Trained,Gentle', urgent: 0, featured: 0 },
    { id: 'dog-19', name: 'Ranger', breed: 'Indie', age_text: '6 yrs', gender: 'Male', weight_kg: 24, size: 'Large', emoji: '🦮', location: 'Mettupalayam Road, Coimbatore', shelter_id: 's7', shelter_name: 'Nilgiris Foothills Rescue', about: 'Brave indie protecting everyone at Nilgiris Foothills shelter.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Experienced owners', energy_level: 'High', exercise: 'Long walks', grooming: 'Low maintenance', space: 'House with yard', diet: 'High protein', traits: 'Brave,Protective', urgent: 1, featured: 0 },
    { id: 'dog-20', name: 'Biscuit', breed: 'Indie', age_text: '5 mo', gender: 'Male', weight_kg: 4, size: 'Small', emoji: '🐶', location: 'Saibaba Colony, Coimbatore', shelter_id: 's1', shelter_name: 'Humane Animal Society', about: 'Golden-brown puppy who melts hearts. Recently rescued and fully vaccinated!', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Very High', exercise: 'Puppy energy!', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy food', traits: 'Golden,Sweet,Playful', urgent: 0, featured: 0 },
    { id: 'dog-21', name: 'Apollo', breed: 'Indie', age_text: '3 yrs', gender: 'Male', weight_kg: 19, size: 'Medium', emoji: '🐕', location: 'Gandhipuram, Coimbatore', shelter_id: 's2', shelter_name: 'Kongu Animal Rescue', about: 'Handsome indie with a regal bearing. Calm and independent companion.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults', energy_level: 'Medium', exercise: '1-2 walks per day', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Kibble + home food', traits: 'Independent,Calm', urgent: 0, featured: 0 },
    { id: 'dog-22', name: 'Honey', breed: 'Labrador', age_text: '4 yrs', gender: 'Female', weight_kg: 24, size: 'Large', emoji: '🐕‍🦺', location: 'Race Course, Coimbatore', shelter_id: 's5', shelter_name: 'Street Dog Care Coimbatore', about: 'Sweet Labrador therapy dog bringing joy wherever she goes.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Regular brushing', space: 'House preferred', diet: 'Lab diet', traits: 'Therapeutic,Sweet', urgent: 0, featured: 0 },
    { id: 'dog-23', name: 'Storm', breed: 'GSD Mix', age_text: '2 yrs', gender: 'Male', weight_kg: 27, size: 'Large', emoji: '🦮', location: 'Saravanampatti, Coimbatore', shelter_id: 's6', shelter_name: 'Second Chance Kovai', about: 'Striking GSD mix with wolf-like features. Intelligent and athletic.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Experienced owners', energy_level: 'Very High', exercise: 'Vigorous exercise', grooming: 'Regular grooming', space: 'House with yard', diet: 'High protein', traits: 'Striking,Intelligent', urgent: 0, featured: 0 },
    { id: 'dog-24', name: 'Mochi', breed: 'Indie', age_text: '4 mo', gender: 'Female', weight_kg: 3, size: 'Small', emoji: '🐶', location: 'Kuniyamuthur, Coimbatore', shelter_id: 's9', shelter_name: 'Kovai Pet Sanctuary', about: 'Cutest puppy at the sanctuary with floppy ears and a non-stop wagging tail.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Very High', exercise: 'Non-stop play!', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy food', traits: 'Cute,Floppy-eared,Happy', urgent: 0, featured: 0 },
    { id: 'dog-25', name: 'Leo', breed: 'Indie', age_text: '2 yrs', gender: 'Male', weight_kg: 21, size: 'Medium', emoji: '🐕', location: 'Vadavalli, Coimbatore', shelter_id: 's8', shelter_name: 'Vadavalli Animal Trust', about: 'Confident, friendly boy rescued from Vadavalli hills. Loves car rides.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'High', exercise: '2 walks + playtime', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble', traits: 'Confident,Friendly', urgent: 0, featured: 0 },
    { id: 'dog-26', name: 'Zara', breed: 'Indie', age_text: '1.5 yrs', gender: 'Female', weight_kg: 13, size: 'Medium', emoji: '🐕‍🦺', location: 'Sulur, Coimbatore', shelter_id: 's12', shelter_name: 'Sulur Rescue Collective', about: 'Gentle, food-motivated girl rescued from Sulur.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble', traits: 'Gentle,Smart', urgent: 0, featured: 0 },
    { id: 'dog-27', name: 'Toby', breed: 'Beagle Mix', age_text: '3 yrs', gender: 'Male', weight_kg: 14, size: 'Medium', emoji: '🐶', location: 'Saibaba Colony, Coimbatore', shelter_id: 's1', shelter_name: 'Humane Animal Society', about: 'Curious Beagle mix with the best nose in the shelter.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Older kids,Dogs', energy_level: 'High', exercise: '2 long walks', grooming: 'Low maintenance', space: 'House preferred', diet: 'Kibble', traits: 'Curious,Playful', urgent: 0, featured: 0 },
    { id: 'dog-28', name: 'Misty', breed: 'Indie', age_text: '10 yrs', gender: 'Female', weight_kg: 16, size: 'Medium', emoji: '🐕', location: 'Kuniyamuthur, Coimbatore', shelter_id: 's9', shelter_name: 'Kovai Pet Sanctuary', about: 'Gentle grandma dog looking for a quiet, warm home for her golden years.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Seniors', energy_level: 'Very Low', exercise: 'Short slow strolls', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Senior soft diet', traits: 'Gentle,Calm,Wise', urgent: 1, featured: 0 },
    { id: 'dog-29', name: 'Jack', breed: 'Indie', age_text: '7 mo', gender: 'Male', weight_kg: 9, size: 'Medium', emoji: '🐶', location: 'Pollachi Main Road, Coimbatore', shelter_id: 's10', shelter_name: 'Pollachi Paws Foundation', about: 'Energetic pup rescued from rural Pollachi. Smart and bold.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Very High', exercise: 'Lots of exercise', grooming: 'Low maintenance', space: 'House with yard', diet: 'Puppy food', traits: 'Energetic,Bold', urgent: 0, featured: 0 },
    { id: 'dog-30', name: 'Ruby', breed: 'Indie', age_text: '3 yrs', gender: 'Female', weight_kg: 15, size: 'Medium', emoji: '🐕‍🦺', location: 'Annur, Coimbatore', shelter_id: 's11', shelter_name: 'Annur Animal Aid', about: 'Calm, watchful girl rescued from Annur. Loyal companion.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble', traits: 'Calm,Watchful,Loyal', urgent: 0, featured: 0 },
    { id: 'dog-31', name: 'Oscar', breed: 'Lab Mix', age_text: '6 yrs', gender: 'Male', weight_kg: 27, size: 'Large', emoji: '🐕', location: 'Peelamedu, Coimbatore', shelter_id: 's4', shelter_name: 'Paws & Care Kovai', about: 'Gentle Lab mix who was a beloved pet. Superb with children.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Moderate shedding', space: 'House preferred', diet: 'Kibble + rice', traits: 'Gentle,Loving', urgent: 0, featured: 0 },
    { id: 'dog-32', name: 'Pixie', breed: 'Spitz Mix', age_text: '1 yr', gender: 'Female', weight_kg: 6, size: 'Small', emoji: '🐩', location: 'R.S. Puram, Coimbatore', shelter_id: 's3', shelter_name: 'Blue Cross of Coimbatore', about: 'Tiny dynamo with a fluffy coat and endless energy.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Older kids', energy_level: 'High', exercise: 'Short walks + play', grooming: 'Regular grooming', space: 'Apartment-friendly', diet: 'Small breed kibble', traits: 'Energetic,Fluffy', urgent: 0, featured: 0 },
    { id: 'dog-33', name: 'Bear', breed: 'Indie', age_text: '4 yrs', gender: 'Male', weight_kg: 29, size: 'Large', emoji: '🦮', location: 'Mettupalayam Road, Coimbatore', shelter_id: 's7', shelter_name: 'Nilgiris Foothills Rescue', about: 'Big calm hill-region indie with a teddy-bear face. Gentle giant.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Seasonal shedding', space: 'House with yard', diet: 'Kibble', traits: 'Gentle-giant,Calm', urgent: 0, featured: 0 },
    { id: 'dog-34', name: 'Lucy', breed: 'Indie', age_text: '9 mo', gender: 'Female', weight_kg: 11, size: 'Medium', emoji: '🐶', location: 'Sulur, Coimbatore', shelter_id: 's12', shelter_name: 'Sulur Rescue Collective', about: 'Bright, affectionate adolescent rescued near Sulur airport road.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'High', exercise: 'Walks + training', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy/adult mix', traits: 'Bright,Affectionate', urgent: 0, featured: 0 },
    { id: 'dog-35', name: 'Rambo', breed: 'GSD Mix', age_text: '5 yrs', gender: 'Male', weight_kg: 31, size: 'Large', emoji: '🦮', location: 'Saravanampatti, Coimbatore', shelter_id: 's6', shelter_name: 'Second Chance Kovai', about: 'Powerful, devoted GSD mix who bonds deeply with his person.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Experienced owners', energy_level: 'Very High', exercise: 'Intense daily exercise', grooming: 'Regular grooming', space: 'House with yard', diet: 'High protein', traits: 'Powerful,Devoted', urgent: 0, featured: 0 },
    { id: 'dog-36', name: 'Olive', breed: 'Indie', age_text: '2 yrs', gender: 'Female', weight_kg: 13, size: 'Medium', emoji: '🐕‍🦺', location: 'Gandhipuram, Coimbatore', shelter_id: 's2', shelter_name: 'Kongu Animal Rescue', about: 'Soft-natured girl found caring for her pups under a flyover. Ready for her home.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 gentle walks', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble', traits: 'Soft-natured,Sweet', urgent: 1, featured: 0 },
    { id: 'dog-37', name: 'Scooby', breed: 'Great Dane Mix', age_text: '3 yrs', gender: 'Male', weight_kg: 38, size: 'Large', emoji: '🦮', location: 'Ramanathapuram, Coimbatore', shelter_id: 's13', shelter_name: 'Coimbatore Animal Welfare Trust', about: 'Goofy, affectionate gentle giant rescued from a closed breeding setup.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Older kids', energy_level: 'Medium', exercise: '2 long walks', grooming: 'Moderate shedding', space: 'House with yard', diet: 'High protein', traits: 'Goofy,Gentle-giant', urgent: 0, featured: 0 },
    { id: 'dog-38', name: 'Maya', breed: 'Indie', age_text: '1 yr', gender: 'Female', weight_kg: 11, size: 'Medium', emoji: '🐕‍🦺', location: 'Singanallur, Coimbatore', shelter_id: 's14', shelter_name: 'Tail Waggers Rescue', about: 'Bright-eyed young girl rescued near Singanallur lake. Adores children.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'High', exercise: '2 walks + play', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble', traits: 'Bright,Playful', urgent: 0, featured: 0 },
    { id: 'dog-39', name: 'Toffee', breed: 'Indie', age_text: '6 mo', gender: 'Male', weight_kg: 7, size: 'Small', emoji: '🐶', location: 'Thudiyalur, Coimbatore', shelter_id: 's15', shelter_name: 'Kovai Compassion Home', about: 'Caramel-coated pup with floppy ears and endless tail wag.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Very High', exercise: 'Lots of play', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy food', traits: 'Caramel,Waggy', urgent: 0, featured: 0 },
    { id: 'dog-40', name: 'Bruno II', breed: 'Rottweiler Mix', age_text: '4 yrs', gender: 'Male', weight_kg: 34, size: 'Large', emoji: '🦮', location: 'Ondipudur, Coimbatore', shelter_id: 's16', shelter_name: 'Ganesh Animal Shelter', about: 'Powerful, deeply loyal Rottweiler mix seeking experienced handler.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Experienced owners', energy_level: 'High', exercise: 'Vigorous daily exercise', grooming: 'Low maintenance', space: 'House with yard', diet: 'High protein', traits: 'Powerful,Loyal', urgent: 0, featured: 0 },
    { id: 'dog-41', name: 'Chinni', breed: 'Indie', age_text: '2 yrs', gender: 'Female', weight_kg: 12, size: 'Medium', emoji: '🐕', location: 'Ganapathy, Coimbatore', shelter_id: 's17', shelter_name: 'Kovai Indie Care', about: 'Sweet, low-key indie fully recovered from a fracture treatment.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'Medium', exercise: '2 gentle walks', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Kibble', traits: 'Sweet,Low-key', urgent: 0, featured: 0 },
    { id: 'dog-42', name: 'Rusty', breed: 'Indie', age_text: '7 yrs', gender: 'Male', weight_kg: 19, size: 'Medium', emoji: '🐕', location: 'Thondamuthur, Coimbatore', shelter_id: 's18', shelter_name: 'Western Ghats Animal Refuge', about: 'Wise senior from the Western Ghats foothills. Calm and gentle.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Seniors', energy_level: 'Low', exercise: 'Short gentle walks', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Senior diet', traits: 'Wise,Calm', urgent: 1, featured: 0 },
    { id: 'dog-43', name: 'Snowy', breed: 'Spitz Mix', age_text: '1.5 yrs', gender: 'Female', weight_kg: 6, size: 'Small', emoji: '🐩', location: 'Ganapathy, Coimbatore', shelter_id: 's17', shelter_name: 'Kovai Indie Care', about: 'Fluffy white charmer who loves laps and gentle brushing.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Older kids', energy_level: 'Medium', exercise: 'Short walks', grooming: 'Regular grooming', space: 'Apartment-friendly', diet: 'Small breed kibble', traits: 'Fluffy,Charming', urgent: 0, featured: 0 },
    { id: 'dog-44', name: 'Kalu', breed: 'Indie', age_text: '3 yrs', gender: 'Male', weight_kg: 21, size: 'Medium', emoji: '🐕', location: 'Madukkarai, Coimbatore', shelter_id: 's20', shelter_name: 'Madukkarai Street Animal Project', about: 'Striking black indie, brilliant with other dogs.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'High', exercise: '2 walks + play', grooming: 'Low maintenance', space: 'Any home', diet: 'Kibble', traits: 'Striking,Social', urgent: 0, featured: 0 },
    { id: 'dog-45', name: 'Dolly', breed: 'Beagle Mix', age_text: '2 yrs', gender: 'Female', weight_kg: 13, size: 'Medium', emoji: '🐶', location: 'Singanallur, Coimbatore', shelter_id: 's14', shelter_name: 'Tail Waggers Rescue', about: 'Sniffy, food-loving Beagle mix with the sweetest howl.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Everyone', energy_level: 'High', exercise: '2 long sniffy walks', grooming: 'Low maintenance', space: 'House preferred', diet: 'Kibble', traits: 'Sniffy,Sweet', urgent: 0, featured: 0 },
    { id: 'dog-46', name: 'Thor', breed: 'GSD Mix', age_text: '5 yrs', gender: 'Male', weight_kg: 32, size: 'Large', emoji: '🦮', location: 'Ramanathapuram, Coimbatore', shelter_id: 's13', shelter_name: 'Coimbatore Animal Welfare Trust', about: 'Noble, intelligent GSD mix who bonds intensely with his person.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Experienced owners', energy_level: 'Very High', exercise: 'Intense daily exercise', grooming: 'Regular grooming', space: 'House with yard', diet: 'High protein', traits: 'Noble,Intelligent', urgent: 0, featured: 0 },
    { id: 'dog-47', name: 'Mimi', breed: 'Indie', age_text: '5 mo', gender: 'Female', weight_kg: 5, size: 'Small', emoji: '🐶', location: 'Thudiyalur, Coimbatore', shelter_id: 's15', shelter_name: 'Kovai Compassion Home', about: 'Tiny, curious explorer rescued from a storm drain.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Experienced owners', energy_level: 'Very High', exercise: 'Supervised play', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Puppy food', traits: 'Tiny,Curious', urgent: 0, featured: 0 },
    { id: 'dog-48', name: 'Caesar', breed: 'Indie', age_text: '8 yrs', gender: 'Male', weight_kg: 23, size: 'Medium', emoji: '🐕', location: 'Ondipudur, Coimbatore', shelter_id: 's16', shelter_name: 'Ganesh Animal Shelter', about: 'Dignified elder who spent years as a beloved neighbourhood dog in Ondipudur.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Adults,Seniors', energy_level: 'Low', exercise: 'Short walks', grooming: 'Low maintenance', space: 'Apartment-friendly', diet: 'Senior soft diet', traits: 'Dignified,Calm', urgent: 1, featured: 0 },
    { id: 'dog-49', name: 'Pippa', breed: 'Indie', age_text: '10 mo', gender: 'Female', weight_kg: 10, size: 'Medium', emoji: '🐕‍🦺', location: 'Karumathampatti, Coimbatore', shelter_id: 's19', shelter_name: 'Karumathampatti Animal Aid', about: 'Joyful adolescent eager to please and wonderful with kids.', vaccinated: 1, neutered: 0, dewormed: 1, microchipped: 0, good_with: 'Everyone', energy_level: 'High', exercise: 'Walks + training', grooming: 'Low maintenance', space: 'Any home', diet: 'Puppy/adult mix', traits: 'Joyful,Eager', urgent: 0, featured: 0 },
    { id: 'dog-50', name: 'Rocky II', breed: 'Indie', age_text: '4 yrs', gender: 'Male', weight_kg: 24, size: 'Large', emoji: '🐕', location: 'Madukkarai, Coimbatore', shelter_id: 's20', shelter_name: 'Madukkarai Street Animal Project', about: 'Strong, even-tempered indie who guarded a workshop.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Dogs', energy_level: 'Medium', exercise: '2 walks per day', grooming: 'Low maintenance', space: 'House preferred', diet: 'Kibble', traits: 'Strong,Steady', urgent: 0, featured: 0 },
    { id: 'dog-51', name: 'Bubbles', breed: 'Pomeranian Mix', age_text: '1 yr', gender: 'Female', weight_kg: 5, size: 'Small', emoji: '🐩', location: 'Ramanathapuram, Coimbatore', shelter_id: 's13', shelter_name: 'Coimbatore Animal Welfare Trust', about: 'Pint-sized bundle of fluff and personality. Perfect for apartment living.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 0, good_with: 'Adults,Older kids', energy_level: 'Medium', exercise: 'Short walks', grooming: 'Regular grooming', space: 'Apartment-friendly', diet: 'Small breed kibble', traits: 'Pint-sized,Fluffy', urgent: 0, featured: 0 },
    { id: 'dog-52', name: 'Hero', breed: 'Indie', age_text: '6 yrs', gender: 'Male', weight_kg: 25, size: 'Large', emoji: '🦮', location: 'Thondamuthur, Coimbatore', shelter_id: 's18', shelter_name: 'Western Ghats Animal Refuge', about: 'Hero earned his name protecting a litter during a flood near Thondamuthur.', vaccinated: 1, neutered: 1, dewormed: 1, microchipped: 1, good_with: 'Experienced owners', energy_level: 'High', exercise: 'Long walks', grooming: 'Low maintenance', space: 'House with yard', diet: 'High protein', traits: 'Brave,Devoted', urgent: 1, featured: 0 }
  ],
  articles: [
    { id: 'a1', title: 'How to prepare your home for a new dog', category: 'Tips', emoji: '🏠', read_time: '4 min', author: 'Dr. Priya Sharma', summary: 'Essential checklist before bringing your adopted dog home', likes: 289, bg_color: '#1a2a1a' },
    { id: 'a2', title: 'Why adopt, not shop?', category: 'Awareness', emoji: '🐾', read_time: '5 min', author: 'PawFinder Team', summary: 'The case for adoption over purchasing from breeders', likes: 445, bg_color: '#2a1a1a' },
    { id: 'a3', title: 'Complete vaccination guide for dogs', category: 'Health', emoji: '💉', read_time: '6 min', author: 'Dr. Rajesh Kumar', summary: 'Everything you need to know about keeping your dog protected in Kovai', likes: 312, bg_color: '#1a1a2a' },
    { id: 'a4', title: 'Understanding indie dog behavior', category: 'Training', emoji: '🐕', read_time: '5 min', author: 'Meera Sundaram', summary: 'A guide to living with Indian street rescues', likes: 187, bg_color: '#2a2a1a' },
    { id: 'a5', title: 'Reading your dog body language', category: 'Tips', emoji: '🐾', read_time: '4 min', author: 'Dr. Anitha Rao', summary: 'Learn to understand what your dog is telling you', likes: 156, bg_color: '#1a2a2a' },
    { id: 'a6', title: 'India stray dog crisis: 62 million animals', category: 'Awareness', emoji: '🇮🇳', read_time: '7 min', author: 'PawFinder Team', summary: 'The numbers behind the problem and how adoption changes lives', likes: 631, bg_color: '#2a1a2a' }
  ],
  applications: [
    { id: 'app1', dog_id: 'dog-1', dog_name: 'Bruno', dog_emoji: '🐕', shelter_name: 'Blue Cross of Coimbatore', status: 'approved', progress: 100, created_at: '2 days ago' },
    { id: 'app2', dog_id: 'dog-2', dog_name: 'Bella', dog_emoji: '🐕‍🦺', shelter_name: 'Kongu Animal Rescue', status: 'pending', progress: 50, created_at: '1 day ago' }
  ],
  fosterDogs: [
    { id: 'f1', name: 'Mango', emoji: '🐕', breed: 'Indie', age_text: '2 yrs', reason: 'Post-surgery recovery — needs quiet home for healing', duration: '3-4 weeks', urgency: 'high', shelter_name: 'Humane Animal Society' },
    { id: 'f2', name: 'Cookie', emoji: '🐶', breed: 'Indie Puppy', age_text: '3 mo', reason: 'Too young for shelter — needs bottle feeding', duration: '6-8 weeks', urgency: 'high', shelter_name: 'Kongu Animal Rescue' },
    { id: 'f3', name: 'Raja', emoji: '🦮', breed: 'GSD Mix', age_text: '5 yrs', reason: 'Shelter overflow — excellent temperament', duration: '4-6 weeks', urgency: 'medium', shelter_name: 'Blue Cross of Coimbatore' },
    { id: 'f4', name: 'Lily', emoji: '🐩', breed: 'Spitz Mix', age_text: '3 yrs', reason: 'Nursing mother with 4 puppies', duration: '8 weeks', urgency: 'high', shelter_name: 'Paws & Care Kovai' },
    { id: 'f5', name: 'Goldie', emoji: '🐕‍🦺', breed: 'Lab Mix', age_text: '6 yrs', reason: 'Behavioral rehab — needs experienced foster', duration: '6-8 weeks', urgency: 'medium', shelter_name: 'Street Dog Care Coimbatore' },
    { id: 'f6', name: 'Patches', emoji: '🐶', breed: 'Indie', age_text: '7 mo', reason: 'Recovering from skin treatment', duration: '3-4 weeks', urgency: 'low', shelter_name: 'Second Chance Kovai' }
  ],
  volunteerRoles: [
    { id: 'r1', title: 'Dog Walker', emoji: '🚶', description: 'Walk shelter dogs on weekends. 2-hour shifts.', bg_color: '#1a2a1a', spots_status: 'open', spots_text: '12 spots' },
    { id: 'r2', title: 'Feeding Volunteer', emoji: '🍚', description: 'Help prepare and serve meals. Morning shifts.', bg_color: '#2a2a1a', spots_status: 'open', spots_text: '8 spots' },
    { id: 'r3', title: 'Adoption Counselor', emoji: '💬', description: 'Guide potential adopters through the process.', bg_color: '#1a1a2a', spots_status: 'limited', spots_text: '3 spots' },
    { id: 'r4', title: 'Medical Assistant', emoji: '💊', description: 'Assist vets during check-ups and treatments.', bg_color: '#2a2a1a', spots_status: 'limited', spots_text: '2 spots' },
    { id: 'r5', title: 'Photography', emoji: '📸', description: 'Take adoption photos of dogs for the website.', bg_color: '#1a2a2a', spots_status: 'open', spots_text: '5 spots' }
  ],
  volunteerEvents: [
    { id: 'e1', title: 'Weekend Adoption Drive', description: 'Meet adoptable dogs at Brookefields Mall, Coimbatore. Bring your family!', event_date: 'SAT, MAY 24', attendees: 45, max_attendees: 100 },
    { id: 'e2', title: 'Vaccination Camp', description: 'Free vaccination camp at Humane Animal Society, Saibaba Colony. Bring strays from your area.', event_date: 'SUN, MAY 25', attendees: 28, max_attendees: 50 },
    { id: 'e3', title: 'Dog Training Workshop', description: 'Learn basic training techniques from certified behaviorists at Race Course grounds.', event_date: 'SAT, MAY 31', attendees: 32, max_attendees: 40 }
  ],
  leaderboard: [
    { rank: 1, name: 'Kavitha R.', sub: '14 dogs adopted & fostered', points: 1450 },
    { rank: 2, name: 'Siddharth M.', sub: '80+ volunteer hours', points: 1210 },
    { rank: 3, name: 'Adithya Kumar', sub: 'Active Paw Pioneer', points: 980 }
  ],
  chatMessages: [
    { sender: 'shelter', content: 'Hello! Thank you for reaching out to Blue Cross of Coimbatore. How can we help you today?' },
    { sender: 'user', content: 'Hi, I am interested in adopting Bruno!' },
    { sender: 'shelter', content: 'Bruno is a wonderful boy! You can submit an adoption application directly from his profile.' }
  ]
};

function mockFallback(method, url, data) {
  // Auth
  if (url.includes('/api/auth/me')) return { user: MOCK_DATA.user };
  if (url.includes('/api/auth/login')) return { user: MOCK_DATA.user };
  if (url.includes('/api/auth/register')) return { user: MOCK_DATA.user };
  if (url.includes('/api/auth/logout')) return { success: true };

  // Notifications
  if (url.includes('/api/users/notifications/read')) {
    MOCK_DATA.notifications.forEach(n => n.read = 1);
    return { success: true };
  }
  if (url.includes('/api/users/notifications')) return { notifications: MOCK_DATA.notifications, unread: MOCK_DATA.notifications.filter(n => !n.read).length };

  // Favourites
  if (url.includes('/favourite')) {
    const dogId = url.split('/api/dogs/')[1].split('/')[0];
    if (!MOCK_DATA.favourites) MOCK_DATA.favourites = {};
    if (method === 'POST') {
      MOCK_DATA.favourites[dogId] = !MOCK_DATA.favourites[dogId];
      return { favourited: MOCK_DATA.favourites[dogId] };
    }
    return { favourited: !!MOCK_DATA.favourites[dogId] };
  }
  if (url.includes('/api/users/favourites')) {
    const favIds = Object.keys(MOCK_DATA.favourites || {}).filter(k => MOCK_DATA.favourites[k]);
    const favDogs = MOCK_DATA.dogs.filter(d => favIds.includes(d.id));
    return { dogs: favDogs.length ? favDogs : MOCK_DATA.dogs.slice(0, 4) };
  }

  // Profile & Leaderboard
  if (url.includes('/api/users/profile') && method === 'PUT') {
    if (data) MOCK_DATA.user = { ...MOCK_DATA.user, ...data };
    return { success: true, user: MOCK_DATA.user };
  }
  if (url.includes('/api/users/profile')) return { user: MOCK_DATA.user, stats: { applications: MOCK_DATA.applications.length, favourites: Object.keys(MOCK_DATA.favourites || {}).length || 5, articles: 4, volunteer_hrs: 12 } };
  if (url.includes('/api/users/leaderboard')) return { leaders: MOCK_DATA.leaderboard };

  // Shelters
  if (url.includes('/api/shelters/stats')) return { stats: { total_shelters: MOCK_DATA.shelters.length, total_dogs: MOCK_DATA.dogs.length, total_rehomed: 1045, total_volunteers: 480 } };
  if (url.includes('/api/shelters/')) {
    const sId = url.split('/api/shelters/')[1].split('?')[0];
    const shelter = MOCK_DATA.shelters.find(s => s.id === sId) || MOCK_DATA.shelters[0];
    return { shelter, dogs: MOCK_DATA.dogs.filter(d => d.shelter_id === shelter.id) };
  }
  if (url.includes('/api/shelters')) {
    let list = [...MOCK_DATA.shelters];
    try {
      const u = new URL(url, 'http://localhost');
      const filter = u.searchParams.get('filter');
      const search = u.searchParams.get('search');
      if (filter === 'verified') list = list.filter(s => s.verified);
      else if (filter === 'near') list = list.filter(s => s.distance_km <= 5);
      else if (filter === 'most_dogs') list = [...list].sort((a, b) => b.dogs_available - a.dogs_available);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
      }
    } catch (e) {}
    return { shelters: list };
  }

  // Foster & Volunteer
  if (url.includes('/api/foster/stats')) return { active_fosters: 18, dogs_fostered: 142, become_adopters: 78 };
  if (url.includes('/api/foster')) return { dogs: MOCK_DATA.fosterDogs };
  if (url.includes('/api/volunteer/roles')) return { roles: MOCK_DATA.volunteerRoles };
  if (url.includes('/api/volunteer/events')) return { events: MOCK_DATA.volunteerEvents };
  if (url.includes('/api/volunteer/leaderboard')) return { leaderboard: MOCK_DATA.leaderboard };
  if (url.includes('/api/volunteer/stats')) return { total_volunteers: 480, open_roles: 14, return_rate: 92 };
  if (url.includes('/api/volunteer')) return { roles: MOCK_DATA.volunteerRoles, events: MOCK_DATA.volunteerEvents };

  // Dogs (Admin & User)
  if (url.includes('/api/dogs/featured')) return { dog: MOCK_DATA.dogs[0] };
  if (url.includes('/api/dogs/urgent')) return { dogs: MOCK_DATA.dogs.filter(d => d.urgent) };
  if (url.includes('/api/dogs/recent')) return { dogs: MOCK_DATA.dogs.slice(0, 6) };
  if (url.includes('/api/dogs/admin/all')) return { dogs: MOCK_DATA.dogs };
  if (url.includes('/api/dogs') && method === 'POST') {
    const newDog = { id: 'dog-' + Date.now(), ...data, emoji: data.emoji || '🐕' };
    MOCK_DATA.dogs.unshift(newDog);
    return { success: true, dog: newDog };
  }
  if (url.includes('/api/dogs/') && method === 'PUT') {
    const dogId = url.split('/api/dogs/')[1];
    const idx = MOCK_DATA.dogs.findIndex(d => d.id === dogId);
    if (idx !== -1) MOCK_DATA.dogs[idx] = { ...MOCK_DATA.dogs[idx], ...data };
    return { success: true, dog: MOCK_DATA.dogs[idx] };
  }
  if (url.includes('/api/dogs/') && method === 'DELETE') {
    const dogId = url.split('/api/dogs/')[1];
    MOCK_DATA.dogs = MOCK_DATA.dogs.filter(d => d.id !== dogId);
    return { success: true };
  }
  if (url.includes('/api/dogs/')) {
    const dogId = url.split('/api/dogs/')[1].split('/')[0];
    const dog = MOCK_DATA.dogs.find(d => d.id === dogId) || MOCK_DATA.dogs[0];
    const similar = MOCK_DATA.dogs.filter(d => d.id !== dog.id && d.shelter_id === dog.shelter_id).slice(0, 3);
    if (!similar.length) similar.push(...MOCK_DATA.dogs.filter(d => d.id !== dog.id).slice(0, 3));
    const favourited = MOCK_DATA.favourites ? !!MOCK_DATA.favourites[dog.id] : false;
    return { dog, similar, favourited };
  }
  if (url.includes('/api/dogs')) {
    let list = [...MOCK_DATA.dogs];
    try {
      const u = new URL(url, 'http://localhost');
      const breed = u.searchParams.get('breed');
      const gender = u.searchParams.get('gender');
      const size = u.searchParams.get('size');
      const search = u.searchParams.get('search');
      if (breed) list = list.filter(d => d.breed.toLowerCase().includes(breed.toLowerCase()));
      if (gender) list = list.filter(d => d.gender.toLowerCase() === gender.toLowerCase());
      if (size) list = list.filter(d => d.size.toLowerCase() === size.toLowerCase());
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || d.breed.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
      }
    } catch (e) {}
    return { dogs: list };
  }

  // Articles
  if (url.includes('/api/articles/')) {
    const aId = url.split('/api/articles/')[1].split('/')[0];
    const article = MOCK_DATA.articles.find(a => a.id === aId) || MOCK_DATA.articles[0];
    return { article, related: MOCK_DATA.articles.filter(a => a.id !== article.id).slice(0, 3) };
  }
  if (url.includes('/api/articles')) return { articles: MOCK_DATA.articles };

  // Applications
  if (url.includes('/decision')) {
    const parts = url.split('/');
    const appId = parts[parts.indexOf('applications') + 1];
    const app = MOCK_DATA.applications.find(a => a.id === appId);
    if (app && data && data.decision) {
      app.status = data.decision;
      app.progress = data.decision === 'approved' ? 100 : (data.decision === 'rejected' ? 0 : 50);
    }
    return { success: true };
  }
  if (url.includes('/api/applications/admin/all')) {
    let list = [...MOCK_DATA.applications];
    try {
      const u = new URL(url, 'http://localhost');
      const status = u.searchParams.get('status');
      if (status && status !== 'all') list = list.filter(a => a.status === status);
    } catch (e) {}
    const pending = MOCK_DATA.applications.filter(a => a.status === 'pending').length;
    const approved = MOCK_DATA.applications.filter(a => a.status === 'approved').length;
    const rejected = MOCK_DATA.applications.filter(a => a.status === 'rejected').length;
    return { applications: list, counts: { pending, approved, rejected } };
  }
  if (url.includes('/api/applications') && method === 'POST') {
    const dog = MOCK_DATA.dogs.find(d => d.id === data.dog_id) || MOCK_DATA.dogs[0];
    const newApp = {
      id: 'app-' + Date.now(),
      dog_id: dog.id,
      dog_name: dog.name,
      dog_emoji: dog.emoji || '🐕',
      shelter_name: dog.shelter_name || 'Coimbatore Shelter',
      status: 'pending',
      progress: 25,
      created_at: 'Just now'
    };
    MOCK_DATA.applications.unshift(newApp);
    return { success: true, application: newApp };
  }
  if (url.includes('/api/applications')) return { applications: MOCK_DATA.applications };

  // Chat
  if (url.includes('/api/chat') && method === 'POST') {
    if (data && data.content) MOCK_DATA.chatMessages.push({ sender: 'user', content: data.content });
    return { success: true, aiMessage: 'Thank you for contacting us! A shelter representative from Coimbatore will reply to your message shortly.' };
  }
  if (url.includes('/api/chat')) return { messages: MOCK_DATA.chatMessages };

  // Admin fallbacks
  if (url.includes('/api/admin/applications')) return { applications: MOCK_DATA.applications, counts: { pending: 1, approved: 1, rejected: 0 } };
  if (url.includes('/api/admin/dogs')) return { dogs: MOCK_DATA.dogs };
  if (url.includes('/api/admin/shelters')) return { shelters: MOCK_DATA.shelters };

  return { success: true };
}

const API = {
  async get(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return mockFallback('GET', url);
    }
  },
  async post(url, data) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return mockFallback('POST', url, data);
    }
  },
  async put(url, data) {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return mockFallback('PUT', url, data);
    }
  },
  async del(url) {
    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (err) {
      return mockFallback('DELETE', url);
    }
  }
};

// ── State ──
let currentUser = null;
let currentDog = null;
let currentShelterId = null;
let currentFilter = 'all';
let pageHistory = [];
let fosterCache = {};
let adminTab = 'applications';
let adminAppStatus = 'all';
let shelterCache = {};

// ── Utility ──
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function showLoading(msg = 'Loading...') {
  $('#loading-text').textContent = msg;
  $('#loading').style.display = 'flex';
}
function hideLoading() { $('#loading').style.display = 'none'; }

function showPage(id) {
  const current = document.querySelector('.page.active');
  if (current && current.id !== id) {
    pageHistory.push(current.id);
  }
  $$('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
}

function goBack() {
  const prev = pageHistory.pop();
  if (prev) {
    $$('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(prev).classList.add('active');
  }
}

// ── Auth ──
async function checkAuth() {
  try {
    const { user } = await API.get('/api/auth/me');
    if (user) {
      currentUser = user;
      enterApp();
    }
  } catch (e) { /* not logged in */ }
}

async function login(email, password) {
  if (!email || !email.trim()) email = 'demo@pawfinder.in';
  if (!password || !password.trim()) password = 'demo123';
  if ($('#login-email')) $('#login-email').value = email;
  if ($('#login-password')) $('#login-password').value = password;
  try {
    const res = await API.post('/api/auth/login', { email, password });
    currentUser = (res && res.user) || MOCK_DATA.user;
  } catch (e) {
    currentUser = MOCK_DATA.user;
  }
  enterApp();
}

async function register() {
  const data = {
    name: $('#reg-name').value,
    email: $('#reg-email').value,
    phone: $('#reg-phone').value,
    city: $('#reg-city').value,
    password: $('#reg-password').value
  };
  try {
    const { user } = await API.post('/api/auth/register', data);
    currentUser = user;
    enterApp();
  } catch (e) {
    const err = $('#register-error');
    err.textContent = e.error || 'Registration failed';
    err.classList.add('show');
  }
}

async function logout() {
  await API.post('/api/auth/logout');
  currentUser = null;
  $('#bottom-nav').style.display = 'none';
  pageHistory = [];
  showPage('page-login');
}

function enterApp() {
  $('#greeting-text').textContent = `Hello, ${currentUser.name.split(' ')[0]} 👋`;
  $('#user-avatar').textContent = currentUser.avatar_initials || 'U';
  $('#bottom-nav').style.display = 'flex';
  showPage('page-home');
  loadHomePage();
  checkNotifications();
}

// ── Home Page ──
async function loadHomePage() {
  loadFeaturedDog();
  loadDogs();
  loadUrgentDogs();
  loadRecentDogs();
  loadTips();
  renderQuiz();
  loadMapLabel();
}

async function loadMapLabel() {
  try {
    const { stats } = await API.get('/api/shelters/stats');
    const el = $('#map-label');
    if (el && stats) el.textContent = `${stats.total_shelters} shelters across Coimbatore`;
  } catch (e) { /* keep default */ }
}

async function loadFeaturedDog() {
  try {
    const { dog } = await API.get('/api/dogs/featured');
    if (!dog) return;
    $('#featured-dog').innerHTML = `
      <div class="featured-card" data-dog="${dog.id}">
        <div class="featured-img">${dog.emoji}</div>
        <div class="featured-info">
          <div class="featured-name">${dog.name}</div>
          <div class="featured-sub">${dog.breed} · ${dog.age_text} · ${dog.location}</div>
          <div class="verified-badge">🏥 ${dog.shelter_name} · Verified</div>
        </div>
        <button class="featured-adopt-btn" data-dog="${dog.id}">Adopt</button>
      </div>`;
  } catch (e) { console.error(e); }
}

async function loadDogs(filter = 'all', search = '') {
  try {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (search) params.set('search', search);
    const { dogs } = await API.get(`/api/dogs?${params}`);
    renderDogGrid(dogs);
    if (filter === 'all' && !search) {
      const hc = $('#hero-dog-count');
      if (hc) hc.textContent = dogs.length;
    }
  } catch (e) { console.error(e); }
}

function renderDogGrid(dogs) {
  const grid = $('#dog-grid');
  grid.innerHTML = dogs.map(d => `
    <div class="dog-card" data-dog="${d.id}">
      <div class="dog-card-img">
        ${d.urgent ? '<div class="dog-card-urgency">URGENT</div>' : ''}
        ${d.emoji}
      </div>
      <div class="dog-card-body">
        <div class="dog-card-name">${d.name}</div>
        <div class="dog-card-sub">${d.breed} · ${d.age_text} · ${d.gender}</div>
        <div class="dog-card-tags">
          ${d.vaccinated ? '<span class="tag tag-green">Vaccinated</span>' : ''}
          ${d.neutered ? '<span class="tag tag-blue">Neutered</span>' : ''}
          ${d.urgent ? '<span class="tag tag-red">Urgent</span>' : ''}
        </div>
        <div class="dog-card-cta">Meet ${d.name} <span>→</span></div>
      </div>
    </div>`).join('');
}

async function loadUrgentDogs() {
  try {
    const { dogs } = await API.get('/api/dogs/urgent');
    if (!dogs.length) return;
    const banner = $('#urgent-banner');
    banner.style.display = 'block';
    banner.innerHTML = `
      <div class="urgent-title">🚨 Urgent — needs immediate home</div>
      <div class="urgent-sub">These dogs are running out of shelter space</div>
      <div class="urgent-dogs">
        ${dogs.map(d => `<div class="urgent-chip" data-dog="${d.id}">${d.emoji} ${d.name} · ${d.age_text}</div>`).join('')}
      </div>`;
  } catch (e) { console.error(e); }
}

async function loadRecentDogs() {
  try {
    const { dogs } = await API.get('/api/dogs/recent');
    $('#recent-dogs').innerHTML = dogs.map(d => `
      <div class="h-dog-card" data-dog="${d.id}">
        <div class="h-dog-img">${d.emoji}</div>
        <div class="h-dog-body">
          <div class="h-dog-name">${d.name}</div>
          <div class="h-dog-sub">${d.breed} · ${d.age_text}</div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

function loadTips() {
  const tips = [
    { emoji: '🏠', title: 'Prep your home', sub: 'Before your dog arrives', article: 'a1' },
    { emoji: '💉', title: 'Vaccines', sub: 'Full schedule guide', article: 'a3' },
    { emoji: '🐾', title: 'Body language', sub: 'Read your dog', article: 'a5' },
    { emoji: '🍚', title: 'Nutrition', sub: 'Feeding basics', article: 'a7' },
    { emoji: '🧠', title: 'Training 101', sub: 'Positive reinforcement', article: 'a9' }
  ];
  $('#tips-row').innerHTML = tips.map(t => `
    <div class="tip-card" data-article="${t.article}">
      <div class="tip-emoji">${t.emoji}</div>
      <div class="tip-title">${t.title}</div>
      <div class="tip-sub">${t.sub}</div>
    </div>`).join('');
}

// ── Quiz (rotating question bank) ──
const QUIZ_BANK = [
  { q: 'How long is the average gestation period of a dog?', o: ['45 days', '63 days', '90 days', '30 days'], a: 1, e: 'Dogs are pregnant for roughly 63 days (about 9 weeks).' },
  { q: 'At what age should a puppy get its first rabies vaccine?', o: ['2 weeks', '3 months', '8 months', '1 year'], a: 1, e: 'The first rabies shot is given around 3 months of age, with annual boosters after.' },
  { q: 'Which of these foods is toxic to dogs?', o: ['Carrot', 'Boiled rice', 'Grapes', 'Pumpkin'], a: 2, e: 'Grapes and raisins can cause kidney failure in dogs. Onions and chocolate are also toxic.' },
  { q: 'A wagging tail always means a dog is happy.', o: ['True', 'False'], a: 1, e: 'False — a stiff, high wag can signal alertness or agitation. Read the whole body.' },
  { q: 'How often should an adult dog typically be fed?', o: ['Once a day', 'Twice a day', 'Every 2 hours', 'Only at night'], a: 1, e: 'Most adult dogs do well on two meals a day; puppies need 3-4 smaller meals.' },
  { q: 'What is the main benefit of spaying or neutering?', o: ['Faster running', 'Reduces strays & some cancers', 'Changes coat colour', 'Makes dogs aggressive'], a: 1, e: 'Sterilisation humanely reduces the stray population and lowers some cancer risks.' },
  { q: 'Roughly how many stray dogs does India have?', o: ['1 million', '10 million', '62 million', '500,000'], a: 2, e: 'India has an estimated 62 million stray dogs — the largest such population in the world.' },
  { q: 'Best time to walk a dog during a hot Coimbatore summer?', o: ['12-2 PM', 'Before 7 AM or after 6:30 PM', 'Anytime', '3-4 PM'], a: 1, e: 'Walk in the cool early morning or evening; hot pavement can burn paw pads.' },
  { q: 'What does a "play bow" (front down, rear up) mean?', o: ['Aggression', 'An invitation to play', 'Fear', 'Hunger'], a: 1, e: 'The play bow is a friendly invitation to play.' },
  { q: 'The "3-3-3 rule" for a new rescue refers to…', o: ['3 walks, 3 meals, 3 toys', '3 days, 3 weeks, 3 months to settle', '3 vets in 3 days', '3 baths a week'], a: 1, e: '3 days to decompress, 3 weeks to learn the routine, 3 months to truly settle in.' },
  { q: 'Which vaccine is required by law in India?', o: ['Rabies', 'Bordetella', 'Canine Influenza', 'None'], a: 0, e: 'Rabies vaccination is legally required and renewed annually.' },
  { q: 'Indian indie (street) dogs are generally…', o: ['Fragile and sickly', 'Resilient and well-adapted', 'Unable to bond', 'Always aggressive'], a: 1, e: 'Indies are hardy, intelligent, and naturally suited to the Indian climate.' }
];
let quizIndex = Math.floor(Math.random() * QUIZ_BANK.length);
let quizAnswered = false;

function renderQuiz() {
  const card = $('#quiz-card');
  if (!card) return;
  const total = QUIZ_BANK.length;
  const idx = ((quizIndex % total) + total) % total;
  const item = QUIZ_BANK[idx];
  quizAnswered = false;

  const prog = $('#quiz-progress');
  if (prog) prog.textContent = `Q${idx + 1} / ${total}`;
  $('#quiz-question').textContent = item.q;
  $('#quiz-options').innerHTML = item.o.map((opt, i) =>
    `<div class="quiz-option" data-i="${i}">${opt}</div>`).join('');
  const explain = $('#quiz-explain');
  explain.textContent = '';
  explain.classList.remove('show');
  $('#quiz-next').style.display = 'none';
}

function answerQuiz(optEl) {
  if (quizAnswered) return;
  const total = QUIZ_BANK.length;
  const idx = ((quizIndex % total) + total) % total;
  const item = QUIZ_BANK[idx];
  const chosen = Number(optEl.dataset.i);
  quizAnswered = true;

  $$('#quiz-options .quiz-option').forEach(el => {
    const i = Number(el.dataset.i);
    if (i === item.a) el.classList.add('correct');
    else if (i === chosen) el.classList.add('wrong');
    el.style.pointerEvents = 'none';
  });

  const correct = chosen === item.a;
  const explain = $('#quiz-explain');
  explain.innerHTML = `<b>${correct ? '✅ Correct!' : '❌ Not quite.'}</b> ${item.e}`;
  explain.classList.add('show');
  $('#quiz-next').style.display = 'block';
  showToast(correct ? 'Correct! 🎉' : 'Good try — check the explanation');
}

// ── Dog Profile ──
async function openDogProfile(dogId) {
  showLoading('Loading profile...');
  try {
    const { dog, similar } = await API.get(`/api/dogs/${dogId}`);
    currentDog = dog;
    currentShelterId = dog.shelter_id;

    const traits = (dog.traits || '').split(',').filter(Boolean);
    const goodWith = (dog.good_with || '').split(',').filter(Boolean);

    let favHtml = '🤍';
    try {
      const { favourited } = await API.get(`/api/dogs/${dogId}/favourite`);
      if (favourited) {
        favHtml = '❤️';
        $('#heart-btn').classList.add('liked');
      } else {
        $('#heart-btn').classList.remove('liked');
      }
    } catch (e) { /* ok */ }
    $('#heart-btn').innerHTML = favHtml;

    $('#profile-content').innerHTML = `
      <div class="profile-hero">${dog.emoji}</div>
      <div class="profile-body">
        <div class="profile-name-row">
          <div class="profile-name">${dog.name}</div>
          <div class="verified-pill">✓ Verified rescue</div>
        </div>
        <div class="profile-location">📍 ${dog.location || 'Coimbatore'}</div>
        <div class="tags-row">
          ${dog.vaccinated ? '<span class="tag tag-green">Vaccinated</span>' : ''}
          ${dog.neutered ? '<span class="tag tag-blue">Neutered</span>' : ''}
          ${dog.dewormed ? '<span class="tag tag-green">Dewormed</span>' : ''}
          ${dog.microchipped ? '<span class="tag tag-purple">Microchipped</span>' : ''}
          ${dog.urgent ? '<span class="tag tag-red">Urgent</span>' : ''}
        </div>
        <div class="stats-row">
          <div class="stat-box"><div class="stat-val">${dog.age_text}</div><div class="stat-label">Age</div></div>
          <div class="stat-box"><div class="stat-val">${dog.gender}</div><div class="stat-label">Gender</div></div>
          <div class="stat-box"><div class="stat-val">${dog.weight_kg} kg</div><div class="stat-label">Weight</div></div>
          <div class="stat-box"><div class="stat-val">${dog.size}</div><div class="stat-label">Size</div></div>
        </div>
        <div class="stats-row">
          <div class="stat-box" style="text-align:left;padding:14px 16px">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Good with</div>
            <div style="font-size:13px;color:var(--text-secondary)">${goodWith.join(' · ') || 'Ask shelter'}</div>
          </div>
          <div class="stat-box" style="text-align:left;padding:14px 16px">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Energy level</div>
            <div style="font-size:13px;color:var(--accent-light)">${dog.energy_level || 'Medium'}</div>
          </div>
        </div>

        <div class="about-title">About ${dog.name}</div>
        <div class="about-text">${dog.about || 'No description available.'}</div>

        <div class="about-title">Health & Medical</div>
        <div class="info-card">
          <div class="health-row">
            <div class="health-label">Vaccination</div>
            <div class="health-status ${dog.vaccinated ? 'hs-good' : 'hs-pending'}">${dog.vaccinated ? 'Complete ✓' : 'Pending'}</div>
          </div>
          <div class="health-row">
            <div class="health-label">Neutering</div>
            <div class="health-status ${dog.neutered ? 'hs-good' : 'hs-pending'}">${dog.neutered ? 'Done ✓' : 'Pending'}</div>
          </div>
          <div class="health-row">
            <div class="health-label">Deworming</div>
            <div class="health-status ${dog.dewormed ? 'hs-good' : 'hs-pending'}">${dog.dewormed ? 'Up to date ✓' : 'Pending'}</div>
          </div>
          <div class="health-row">
            <div class="health-label">Microchip</div>
            <div class="health-status ${dog.microchipped ? 'hs-good' : 'hs-pending'}">${dog.microchipped ? 'Yes ✓' : 'No'}</div>
          </div>
        </div>

        <div class="about-title">Care needs</div>
        <div class="info-card">
          <div class="info-row"><div class="info-icon">🚶</div><div class="info-text">${dog.exercise || '2 walks per day'}</div></div>
          <div class="info-row"><div class="info-icon">✂️</div><div class="info-text">${dog.grooming || 'Low maintenance'}</div></div>
          <div class="info-row"><div class="info-icon">🏠</div><div class="info-text">${dog.space || 'Apartment-friendly'}</div></div>
          <div class="info-row"><div class="info-icon">🍚</div><div class="info-text">${dog.diet || 'Dry kibble · 2x daily'}</div></div>
        </div>

        <div class="about-title">Personality</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">
          ${traits.map(t => `<span class="trait-chip">${t.trim()}</span>`).join('')}
        </div>

        <div class="about-title">Rescue shelter</div>
        <div class="shelter-card" ${dog.shelter_id ? `data-shelter="${dog.shelter_id}"` : ''} style="cursor:pointer">
          <div class="shelter-icon">🏥</div>
          <div>
            <div class="shelter-name">${dog.shelter_name || 'Unknown'}</div>
            <div class="shelter-sub">Open · ${dog.shelter_hours || '9AM-5PM'} · ${dog.shelter_distance || '?'}km</div>
          </div>
          <div style="margin-left:auto;color:var(--text-muted)">›</div>
        </div>

        ${similar.length ? `
          <div class="about-title">You might also like</div>
          <div class="h-scroll" style="padding:0 0 16px">
            ${similar.map(s => `
              <div class="h-dog-card" data-dog="${s.id}">
                <div class="h-dog-img">${s.emoji}</div>
                <div class="h-dog-body">
                  <div class="h-dog-name">${s.name}</div>
                  <div class="h-dog-sub">${s.breed} · ${s.age_text}</div>
                </div>
              </div>`).join('')}
          </div>` : ''}
      </div>`;

    showPage('page-profile');
  } catch (e) {
    showToast('Failed to load profile');
    console.error(e);
  } finally {
    hideLoading();
  }
}

async function toggleFavourite() {
  if (!currentDog) return;
  try {
    const { favourited } = await API.post(`/api/dogs/${currentDog.id}/favourite`);
    $('#heart-btn').innerHTML = favourited ? '❤️' : '🤍';
    $('#heart-btn').classList.toggle('liked', favourited);
    showToast(favourited ? 'Added to saved dogs ❤️' : 'Removed from saved dogs');
  } catch (e) { showToast('Please sign in first'); }
}

// ── Chat ──
async function openChat(shelterId, shelterName) {
  currentShelterId = shelterId;
  $('#chat-shelter-name').textContent = shelterName || 'Shelter';
  $('#chat-messages').innerHTML = '';
  showPage('page-chat');

  try {
    const { messages } = await API.get(`/api/chat/${shelterId}`);
    messages.forEach(m => appendMessage(m.sender, m.content));
    if (!messages.length) {
      appendMessage('shelter', 'Welcome! How can I help you with your adoption journey? Feel free to ask about our dogs, visiting hours, fees, or anything else. 🐾');
    }
  } catch (e) { console.error(e); }
}

function appendMessage(sender, content) {
  const div = document.createElement('div');
  div.className = `msg-bubble from-${sender === 'user' ? 'user' : 'shelter'}`;
  div.innerHTML = `${content}<div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
  $('#chat-messages').appendChild(div);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
}

async function sendChatMessage(content) {
  if (!content.trim() || !currentShelterId) return;
  appendMessage('user', content);
  $('#chat-input').value = '';

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  $('#chat-messages').appendChild(typing);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;

  try {
    const { aiMessage } = await API.post(`/api/chat/${currentShelterId}`, { content });
    typing.remove();
    appendMessage('shelter', aiMessage.content);
  } catch (e) {
    typing.remove();
    appendMessage('shelter', 'Sorry, I could not process that. Please try again.');
  }
}

// ── Adoption ──
function openAdoptionForm() {
  if (!currentDog) return;
  $('#adopt-dog-card').innerHTML = `
    <div style="font-size:36px">${currentDog.emoji}</div>
    <div>
      <div class="adopt-dog-name">Adopting ${currentDog.name}</div>
      <div class="adopt-dog-sub">${currentDog.shelter_name || 'Shelter'} · ${currentDog.location || 'Coimbatore'}</div>
    </div>
    <div class="step-badge">Step 2/4</div>`;
  showPage('page-adoption');
}

function resetAdoptionForm() {
  ['doc-gov', 'doc-address', 'doc-income', 'doc-photos'].forEach(id => {
    const input = $('#' + id);
    if (input) input.value = '';
    const status = $('#' + id + '-status');
    if (status) {
      status.textContent = id === 'doc-photos' ? 'Choose files' : 'Choose file';
      status.className = 'doc-status pending';
    }
  });
  const reason = $('#adopt-reason');
  if (reason) reason.value = '';
}

async function submitAdoption() {
  if (!currentDog) return;

  const gov = $('#doc-gov').files[0];
  const addr = $('#doc-address').files[0];
  const inc = $('#doc-income').files[0];
  const photos = $('#doc-photos').files;

  if (!gov) { showToast('Government ID is required'); return; }
  if (!addr) { showToast('Address proof is required'); return; }
  if (!photos.length) { showToast('Please add at least one home photo'); return; }

  const btn = $('#submit-adoption-btn');
  btn.disabled = true;
  showLoading('Submitting application & documents...');
  try {
    const getSelected = (group) => {
      const el = document.querySelector(`[data-group="${group}"] .choice-chip.selected`);
      return el ? el.textContent : '';
    };
    const fd = new FormData();
    fd.append('dog_id', currentDog.id);
    fd.append('residence_type', getSelected('residence'));
    fd.append('outdoor_space', getSelected('outdoor'));
    fd.append('experience', getSelected('experience'));
    fd.append('other_pets', $('#adopt-pets').value);
    fd.append('children', $('#adopt-children').value);
    fd.append('alone_hours', $('#adopt-alone').value);
    fd.append('reason', $('#adopt-reason').value);
    fd.append('doc_gov_id', gov);
    fd.append('doc_address', addr);
    if (inc) fd.append('doc_income', inc);
    for (let i = 0; i < photos.length && i < 8; i++) fd.append('doc_photos', photos[i]);

    const res = await fetch('/api/applications', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;

    hideLoading();
    btn.disabled = false;
    showToast('Application & documents submitted! 🎉');
    resetAdoptionForm();
    switchNav(2);
  } catch (e) {
    hideLoading();
    btn.disabled = false;
    showToast(e.error || 'Submission failed');
  }
}

// ── Applications ──
async function loadApplications() {
  try {
    const { applications } = await API.get('/api/applications');
    const countText = applications.length ? `${applications.length} application${applications.length > 1 ? 's' : ''}` : 'No applications yet';
    $('#app-count-text').textContent = countText;

    if (!applications.length) {
      $('#applications-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">📋</div>
          <div class="empty-title">No applications yet</div>
          <div class="empty-sub">Browse dogs and start your first adoption application!</div>
        </div>`;
      return;
    }

    $('#applications-list').innerHTML = applications.map(a => `
      <div class="app-card">
        <div class="app-card-top">
          <div style="font-size:28px">${a.dog_emoji}</div>
          <div>
            <div class="app-card-name">${a.dog_name}</div>
            <div class="app-card-sub">${a.shelter_name || 'Shelter'}</div>
          </div>
          <div class="app-status ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</div>
        </div>
        <div class="app-progress"><div class="app-progress-fill" style="width:${a.progress}%"></div></div>
        <div class="app-timeline">
          <div class="timeline-step"><div class="timeline-dot done"></div><div class="timeline-label done">Application submitted</div></div>
          <div class="timeline-step"><div class="timeline-dot ${a.progress >= 50 ? 'done' : 'pending'}"></div><div class="timeline-label ${a.progress >= 50 ? 'done' : ''}">Shelter review</div></div>
          <div class="timeline-step"><div class="timeline-dot ${a.progress >= 75 ? 'done' : 'pending'}"></div><div class="timeline-label">Home visit</div></div>
          <div class="timeline-step"><div class="timeline-dot pending"></div><div class="timeline-label">Approval</div></div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

// ── Shelters ──
async function loadShelters(filter = 'all', search = '') {
  try {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (search) params.set('search', search);

    const [sheltersRes, statsRes] = await Promise.all([
      API.get(`/api/shelters?${params}`),
      API.get('/api/shelters/stats')
    ]);

    const { stats } = statsRes;
    $('#shelter-stats').innerHTML = `
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_shelters}</div><div class="shelter-stat-label">Shelters</div></div>
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_dogs}</div><div class="shelter-stat-label">Dogs waiting</div></div>
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_rehomed}</div><div class="shelter-stat-label">Rehomed 2024</div></div>
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_volunteers}</div><div class="shelter-stat-label">Volunteers</div></div>`;

    const { shelters } = sheltersRes;
    $('#shelter-list').innerHTML = shelters.map(s => {
      const tags = (s.tags || '').split(',').filter(Boolean);
      return `
        <div class="shelter-list-card" data-shelter="${s.id}">
          <div class="shelter-card-top">
            <div class="shelter-list-icon">${s.emoji}</div>
            <div>
              <div class="shelter-list-name">${s.name}</div>
              <div class="shelter-list-sub">${s.address} · ${s.hours}</div>
            </div>
          </div>
          <div class="shelter-stats-row">
            <div class="shelter-stat">🐕 <span>${s.dogs_available}</span> dogs</div>
            <div class="shelter-stat">📍 <span>${s.distance_km}</span> km</div>
            <div class="shelter-stat">⭐ <span>${s.rating}</span></div>
            <div class="shelter-stat">🏠 <span>${s.dogs_rehomed}</span> rehomed</div>
          </div>
          <div class="shelter-tags">
            ${tags.map(t => `<span class="tag tag-green">${t}</span>`).join('')}
          </div>
        </div>`;
    }).join('');
  } catch (e) { console.error(e); }
}

async function openShelterDetail(shelterId) {
  if (!shelterId) { showToast('Shelter info unavailable'); return; }
  showLoading('Loading shelter...');
  try {
    const { shelter, dogs } = await API.get(`/api/shelters/${shelterId}`);
    currentShelterId = shelter.id;
    const tags = (shelter.tags || '').split(',').filter(Boolean);
    $('#shelter-detail-content').innerHTML = `
      <div class="shelter-detail-hero">
        <div class="shelter-detail-emoji">${shelter.emoji || '🏥'}</div>
        <div class="shelter-detail-name">${shelter.name}</div>
        <div class="shelter-detail-addr">📍 ${shelter.address || 'Coimbatore'}</div>
        ${shelter.verified ? '<div class="verified-pill" style="margin:10px auto 0">✓ Verified shelter</div>' : ''}
      </div>
      <div class="stats-row" style="padding:18px 20px 0">
        <div class="stat-box"><div class="stat-val">${shelter.dogs_available}</div><div class="stat-label">Dogs</div></div>
        <div class="stat-box"><div class="stat-val">${shelter.dogs_rehomed}</div><div class="stat-label">Rehomed</div></div>
        <div class="stat-box"><div class="stat-val">⭐ ${shelter.rating}</div><div class="stat-label">Rating</div></div>
        <div class="stat-box"><div class="stat-val">${shelter.distance_km}km</div><div class="stat-label">Away</div></div>
      </div>
      <div style="padding:18px 20px 0">
        <div class="info-card">
          <div class="info-row"><div class="info-icon">🕒</div><div class="info-text">Open · ${shelter.hours || '9AM-5PM'}</div></div>
          <div class="info-row"><div class="info-icon">📞</div><div class="info-text">${shelter.phone || 'Contact via chat'}</div></div>
          <div class="info-row"><div class="info-icon">✉️</div><div class="info-text">${shelter.email || '—'}</div></div>
          <div class="info-row"><div class="info-icon">🙋</div><div class="info-text">${shelter.volunteers} active volunteers</div></div>
        </div>
        ${tags.length ? `<div class="shelter-tags" style="margin-bottom:6px">${tags.map(t => `<span class="tag tag-green">${t}</span>`).join('')}</div>` : ''}
      </div>
      <div class="section-header"><div class="section-title">Dogs at this shelter (${dogs.length})</div></div>
      ${dogs.length ? `<div class="h-scroll" style="padding:0 20px 12px">${dogs.map(d => `
        <div class="h-dog-card" data-dog="${d.id}">
          <div class="h-dog-img">${d.emoji}${d.urgent ? '<div class="dog-card-urgency" style="font-size:8px">URGENT</div>' : ''}</div>
          <div class="h-dog-body"><div class="h-dog-name">${d.name}</div><div class="h-dog-sub">${d.breed} · ${d.age_text}</div></div>
        </div>`).join('')}</div>` : '<div style="padding:0 20px 16px;color:var(--text-secondary);font-size:14px">No dogs currently listed here.</div>'}
      <div style="padding:8px 20px 28px">
        <button class="btn-primary" id="shelter-detail-chat-btn">💬 Chat with ${shelter.name}</button>
      </div>`;
    $('#shelter-detail-chat-btn').addEventListener('click', () => openChat(shelter.id, shelter.name));
    showPage('page-shelter-detail');
  } catch (e) {
    showToast('Failed to load shelter');
    console.error(e);
  } finally {
    hideLoading();
  }
}

// ── Foster ──
async function loadFoster() {
  try {
    const [dogsRes, statsRes] = await Promise.all([
      API.get('/api/foster'),
      API.get('/api/foster/stats')
    ]);

    const { active_fosters, dogs_fostered, become_adopters } = statsRes;
    $('#foster-hero').innerHTML = `
      <div class="foster-hero-emoji">🏠</div>
      <div class="foster-hero-title">Become a foster parent</div>
      <div class="foster-hero-sub">No commitment to adopt. Just love, space, and time.</div>
      <div class="foster-stats">
        <div><div class="foster-stat-num">${active_fosters}</div><div class="foster-stat-label">Active fosters</div></div>
        <div><div class="foster-stat-num">${dogs_fostered}</div><div class="foster-stat-label">Dogs fostered</div></div>
        <div><div class="foster-stat-num">${become_adopters}%</div><div class="foster-stat-label">Become adopters</div></div>
      </div>`;

    const { dogs } = dogsRes;
    fosterCache = {};
    $('#foster-list').innerHTML = dogs.map(d => {
      fosterCache[d.id] = d;
      return `
      <div class="foster-card" data-foster="${d.id}">
        <div class="foster-card-top">
          <div class="foster-emoji">${d.emoji}</div>
          <div>
            <div class="foster-name">${d.name}</div>
            <div class="foster-sub">${d.breed} · ${d.age_text}</div>
            <span class="foster-urgency urgency-${d.urgency}">${d.urgency}</span>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">${d.reason}</div>
        <div class="foster-details">
          <div class="foster-detail">⏱ <span>${d.duration}</span></div>
          <div class="foster-detail">🏥 <span>${d.shelter_name || 'Shelter'}</span></div>
        </div>
      </div>`;
    }).join('');

    const faqs = [
      { q: 'Do I need to pay for food and medical?', a: 'No! The shelter covers all food, medical expenses, and basic supplies. You just provide the love and space.' },
      { q: 'What if I want to adopt the foster dog?', a: 'Foster-to-adopt is encouraged! About 78% of our foster parents end up adopting. You get first priority.' },
      { q: 'How long is the foster period?', a: 'Typically 2-8 weeks depending on the dog\'s needs. You can discuss the timeline with the shelter.' },
      { q: 'What if there\'s a medical emergency?', a: 'Call our 24/7 helpline immediately. We have partner vets across the city for emergencies.' }
    ];
    $('#foster-faq').innerHTML = faqs.map(f => `
      <div class="faq-item"><div class="faq-q">${f.q}</div><div class="faq-a">${f.a}</div></div>`).join('');
  } catch (e) { console.error(e); }
}

function openFosterModal(id) {
  const d = fosterCache[id];
  if (!d) return;
  const m = $('#modal-content');
  m.innerHTML = `
    <div style="text-align:center;font-size:52px;margin-bottom:8px">${d.emoji}</div>
    <div class="modal-title" style="text-align:center">${d.name}</div>
    <div class="modal-sub" style="text-align:center">${d.breed} · ${d.age_text} · <span class="foster-urgency urgency-${d.urgency}">${d.urgency} priority</span></div>
    <div class="info-card" style="margin-bottom:14px">
      <div class="info-row"><div class="info-icon">📝</div><div class="info-text">${d.reason}</div></div>
      <div class="info-row"><div class="info-icon">⏱</div><div class="info-text">Foster duration: ${d.duration}</div></div>
      <div class="info-row"><div class="info-icon">🏥</div><div class="info-text">${d.shelter_name || 'Partner shelter'}</div></div>
      <div class="info-row"><div class="info-icon">💊</div><div class="info-text">Food & all medical costs covered by the shelter</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <button class="btn-primary" id="foster-interest-btn">Express interest to foster ${d.name}</button>
      <button class="btn-secondary" id="close-modal-btn">Maybe later</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#foster-interest-btn').addEventListener('click', () => {
    $('#modal').classList.remove('show');
    showToast(`Interest noted! The shelter will contact you about ${d.name} 🐾`);
  });
  $('#close-modal-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
}

// ── Learn / Articles ──
async function loadArticles(category = 'all') {
  try {
    const params = category !== 'all' ? `?category=${category}` : '';
    const { articles } = await API.get(`/api/articles${params}`);

    const pinned = articles.find(a => a.id === 'a6') || articles[0];
    if (pinned) {
      $('#pinned-article').innerHTML = `
        <div class="pinned-label">📌 Must read</div>
        <div class="pinned-title">${pinned.title}</div>
        <div class="pinned-meta">${pinned.read_time} · ${pinned.likes} ♥</div>
        <div class="pinned-summary">${pinned.summary}</div>`;
      $('#pinned-article').dataset.article = pinned.id;
    }

    const filtered = articles.filter(a => a.id !== 'a6');
    $('#articles-list').innerHTML = filtered.map(a => `
      <div class="article-card" data-article="${a.id}">
        <div class="article-card-img" style="background:${a.bg_color || 'var(--surface2)'}">${a.emoji}</div>
        <div class="article-card-body">
          <span class="tag tag-blue" style="margin-bottom:8px">${a.category}</span>
          <div class="article-card-title">${a.title}</div>
          <div class="article-card-summary">${a.summary}</div>
          <div class="article-card-meta">
            <span>${a.author}</span>
            <span>· ${a.read_time}</span>
            <span class="article-card-likes">${a.likes} ♥</span>
          </div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

async function openArticle(articleId) {
  showLoading('Loading article...');
  try {
    const { article, related } = await API.get(`/api/articles/${articleId}`);
    $('#article-page-title').textContent = article.category;
    $('#article-content-wrapper').innerHTML = `
      <div class="article-hero-img" style="background:${article.bg_color || 'var(--surface2)'}">${article.emoji}</div>
      <div class="article-meta">
        <span class="tag tag-blue">${article.category}</span>
        <span style="font-size:12px;color:var(--text-muted)">${article.read_time}</span>
      </div>
      <div class="article-full-title">${article.title}</div>
      <div class="article-byline">By ${article.author} · ${article.likes} ♥</div>
      <div class="article-content">${article.content}</div>
      ${related.length ? `
        <div style="padding:0 20px 24px">
          <div class="about-title">Related articles</div>
          ${related.map(r => `
            <div class="shelter-card" data-article="${r.id}" style="cursor:pointer">
              <div class="shelter-icon" style="font-size:24px">${r.emoji}</div>
              <div>
                <div class="shelter-name">${r.title}</div>
                <div class="shelter-sub">${r.category} · ${r.read_time}</div>
              </div>
              <div style="margin-left:auto;color:var(--text-muted)">›</div>
            </div>`).join('')}
        </div>` : ''}`;
    showPage('page-article');
  } catch (e) {
    showToast('Failed to load article');
  } finally {
    hideLoading();
  }
}

// ── Volunteer ──
async function loadVolunteer() {
  try {
    const [rolesRes, eventsRes, lbRes, statsRes] = await Promise.all([
      API.get('/api/volunteer/roles'),
      API.get('/api/volunteer/events'),
      API.get('/api/volunteer/leaderboard'),
      API.get('/api/volunteer/stats')
    ]);

    const s = statsRes;
    $('#vol-hero').innerHTML = `
      <div class="vol-hero-emoji">🙋‍♀️</div>
      <div class="vol-hero-title">Make a difference every weekend</div>
      <div class="vol-hero-sub">No experience needed. Just show up with heart.</div>
      <div class="vol-stats">
        <div><div class="vol-stat-num">${s.total_volunteers.toLocaleString()}</div><div class="vol-stat-label">Volunteers 2024</div></div>
        <div><div class="vol-stat-num">${s.open_roles}</div><div class="vol-stat-label">Open roles</div></div>
        <div><div class="vol-stat-num">${s.return_rate}%</div><div class="vol-stat-label">Return rate</div></div>
      </div>`;

    const { roles } = rolesRes;
    $('#vol-roles').innerHTML = roles.map(r => `
      <div class="vol-role-card">
        <div class="vol-role-icon" style="background:${r.bg_color}">${r.emoji}</div>
        <div>
          <div class="vol-role-name">${r.title}</div>
          <div class="vol-role-sub">${r.description}</div>
        </div>
        <div class="vol-role-spots spots-${r.spots_status}">${r.spots_text}</div>
      </div>`).join('');

    const { events } = eventsRes;
    $('#vol-events').innerHTML = events.map(e => `
      <div class="vol-event-card">
        <div class="vol-event-date">${e.event_date}</div>
        <div class="vol-event-title">${e.title}</div>
        <div class="vol-event-sub">${e.description}</div>
        <div class="vol-event-footer">
          <button class="vol-attend-btn" onclick="showToast('Registered! See you there 🎉')">Attend</button>
          <div class="vol-attendees">${e.attendees}/${e.max_attendees} attending</div>
        </div>
      </div>`).join('');

    const { leaderboard } = lbRes;
    $('#vol-leaderboard').innerHTML = leaderboard.map(l => `
      <div class="lb-row">
        <div class="lb-rank ${l.rank <= 3 ? 'top' : ''}">${l.rank}</div>
        <div class="lb-avatar" style="background:${l.color}">${l.initials}</div>
        <div>
          <div class="lb-name">${l.name}</div>
          <div class="lb-sub">${l.sub}</div>
        </div>
        <div class="lb-points">${l.points.toLocaleString()}</div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

// ── User Profile ──
async function loadUserProfile() {
  try {
    const { user, stats } = await API.get('/api/users/profile');
    if (!user) return;

    const pp = user.paw_points || 0;
    const ppPct = Math.min(100, (pp / 500) * 100);

    $('#user-profile-content').innerHTML = `
      <div class="user-avatar-large">${user.avatar_initials || 'U'}</div>
      <div class="user-name-large">${user.name}</div>
      <div class="user-email">${user.email}</div>
      <div class="user-location">📍 ${user.city || 'Unknown'}, Tamil Nadu</div>

      <div class="user-stats-row">
        <div class="stat-box"><div class="stat-val">${stats.applications}</div><div class="stat-label">Applications</div></div>
        <div class="stat-box"><div class="stat-val">${stats.favourites}</div><div class="stat-label">Saved dogs</div></div>
        <div class="stat-box"><div class="stat-val">2</div><div class="stat-label">Articles read</div></div>
        <div class="stat-box"><div class="stat-val">0</div><div class="stat-label">Vol. hrs</div></div>
      </div>

      <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:600;margin-bottom:12px">Your badges</div>
      <div class="badge-row">
        <div class="badge-pill earned">🐾 Paw Pioneer</div>
        <div class="badge-pill earned">❤️ Animal Lover</div>
        <div class="badge-pill">🏅 Super Adopter</div>
        <div class="badge-pill">🌟 Top Volunteer</div>
        <div class="badge-pill earned">📰 Reader</div>
      </div>

      <div class="pawpoints-card">
        <div class="pawpoints-header">
          <div class="pawpoints-label">🌟 PawPoints</div>
          <div class="pawpoints-val">${pp} pts</div>
        </div>
        <div class="pawpoints-bar"><div class="pawpoints-fill" style="width:${ppPct}%"></div></div>
        <div class="pawpoints-text">${500 - pp} more points to unlock 🏅 Super Adopter badge</div>
      </div>

      <div class="menu-item" data-action="applications"><div class="menu-icon" style="background:#1a2040">📋</div><div><div class="menu-text">My Applications</div><div class="menu-sub">${stats.applications} active</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="favourites"><div class="menu-icon" style="background:#2a0a0a">❤️</div><div><div class="menu-text">Saved Dogs</div><div class="menu-sub">${stats.favourites} saved</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="volunteer"><div class="menu-icon" style="background:#0a1a2a">🙋</div><div><div class="menu-text">Volunteer</div><div class="menu-sub">Upcoming sessions</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="foster"><div class="menu-icon" style="background:#1a0a2a">🐕</div><div><div class="menu-text">Foster Dogs</div><div class="menu-sub">No active fosters</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="notifications"><div class="menu-icon" style="background:#2a2a0a">🔔</div><div><div class="menu-text">Notifications</div><div class="menu-sub">Check updates</div></div><div class="menu-arrow">›</div></div>
      ${user.is_admin ? `<div class="menu-item admin-menu-item" data-action="admin"><div class="menu-icon" style="background:#0a2a1a">🛡️</div><div><div class="menu-text">Manage Dogs &amp; Shelters</div><div class="menu-sub">Admin · add, edit, delete</div></div><div class="menu-arrow">›</div></div>` : ''}
      <div class="menu-item" data-action="edit-profile"><div class="menu-icon" style="background:#0a1a2a">✏️</div><div><div class="menu-text">Edit Profile</div><div class="menu-sub">Name, phone, city</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="refer"><div class="menu-icon" style="background:#0a1a1a">🔗</div><div><div class="menu-text">Refer a friend</div><div class="menu-sub">Invite friends to adopt</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="help"><div class="menu-icon" style="background:#1a1a1a">❓</div><div><div class="menu-text">Help & FAQs</div><div class="menu-sub">How adoption works</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="logout" style="margin-top:12px"><div class="menu-icon" style="background:#2a0a0a">🚪</div><div><div class="menu-text" style="color:var(--red)">Sign Out</div></div></div>`;
  } catch (e) { console.error(e); }
}

// ── Notifications ──
async function checkNotifications() {
  try {
    const { unread } = await API.get('/api/users/notifications');
    const dot = $('#notif-dot');
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
  } catch (e) { /* ok */ }
}

async function loadNotifications() {
  try {
    const { notifications } = await API.get('/api/users/notifications');
    if (!notifications.length) {
      $('#notifications-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">🔔</div>
          <div class="empty-title">No notifications</div>
          <div class="empty-sub">You are all caught up!</div>
        </div>`;
      return;
    }
    $('#notifications-list').innerHTML = notifications.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <div class="notif-dot-sm ${n.read ? 'read' : ''}"></div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-sub">${n.body || ''}</div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

async function markAllRead() {
  try {
    await API.post('/api/users/notifications/read');
    showToast('All marked as read ✓');
    loadNotifications();
    checkNotifications();
  } catch (e) { showToast('Failed'); }
}

// ── Favourites ──
async function loadFavourites() {
  try {
    const { dogs } = await API.get('/api/users/favourites');
    if (!dogs.length) {
      $('#favourites-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">❤️</div>
          <div class="empty-title">No saved dogs</div>
          <div class="empty-sub">Tap the heart icon on any dog profile to save them here!</div>
        </div>`;
      return;
    }
    $('#favourites-list').innerHTML = `<div class="dog-grid" style="padding:20px">${dogs.map(d => `
      <div class="dog-card" data-dog="${d.id}">
        <div class="dog-card-img">${d.emoji}</div>
        <div class="dog-card-body">
          <div class="dog-card-name">${d.name}</div>
          <div class="dog-card-sub">${d.breed} · ${d.age_text}</div>
        </div>
      </div>`).join('')}</div>`;
  } catch (e) { console.error(e); }
}

// ── Navigation ──
const NAV_PAGES = ['page-home', 'page-shelters', 'page-applications', 'page-foster', 'page-learn', 'page-user-profile'];

function switchNav(index) {
  $$('.nav-item').forEach((n, i) => n.classList.toggle('active', i === index));
  pageHistory = [];
  showPage(NAV_PAGES[index]);

  switch (index) {
    case 1: loadShelters(); break;
    case 2: loadApplications(); break;
    case 3: loadFoster(); break;
    case 4: loadArticles(); break;
    case 5: loadUserProfile(); break;
  }
}

// ── Event Listeners ──
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Auth
  const triggerLogin = () => {
    const em = $('#login-email')?.value || 'demo@pawfinder.in';
    const pw = $('#login-password')?.value || 'demo123';
    login(em, pw);
  };
  $('#login-btn')?.addEventListener('click', triggerLogin);
  $('#login-email')?.addEventListener('keydown', e => { if (e.key === 'Enter') triggerLogin(); });
  $('#login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') triggerLogin(); });

  const fillAndLogin = () => {
    if ($('#login-email')) $('#login-email').value = 'demo@pawfinder.in';
    if ($('#login-password')) $('#login-password').value = 'demo123';
    login('demo@pawfinder.in', 'demo123');
  };
  $('#demo-login-btn')?.addEventListener('click', fillAndLogin);
  $('.demo-box')?.addEventListener('click', fillAndLogin);
  $('#goto-register-btn').addEventListener('click', () => showPage('page-register'));
  $('#register-btn').addEventListener('click', register);

  // Navigation
  $$('[data-nav]').forEach(el => {
    el.addEventListener('click', () => switchNav(Number(el.dataset.nav)));
  });

  // Back buttons
  $$('.btn-back').forEach(btn => {
    btn.addEventListener('click', goBack);
  });

  // Dog clicks (delegated)
  document.addEventListener('click', e => {
    const dogEl = e.target.closest('[data-dog]');
    if (dogEl) {
      e.preventDefault();
      openDogProfile(dogEl.dataset.dog);
      return;
    }
    const fosterEl = e.target.closest('[data-foster]');
    if (fosterEl) {
      e.preventDefault();
      openFosterModal(fosterEl.dataset.foster);
      return;
    }
    const articleEl = e.target.closest('[data-article]');
    if (articleEl) {
      e.preventDefault();
      openArticle(articleEl.dataset.article);
      return;
    }
    const shelterEl = e.target.closest('[data-shelter]');
    if (shelterEl) {
      e.preventDefault();
      openShelterDetail(shelterEl.dataset.shelter);
      return;
    }
  });

  // Profile actions
  $('#heart-btn').addEventListener('click', toggleFavourite);
  $('#profile-chat-btn').addEventListener('click', () => {
    if (currentDog) openChat(currentDog.shelter_id, currentDog.shelter_name);
  });
  $('#profile-adopt-btn').addEventListener('click', openAdoptionForm);

  // Chat
  $('#chat-send-btn').addEventListener('click', () => sendChatMessage($('#chat-input').value));
  $('#chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage($('#chat-input').value); });
  $$('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => sendChatMessage(btn.dataset.msg));
  });

  // Adoption
  $('#submit-adoption-btn').addEventListener('click', submitAdoption);
  $('#save-draft-btn').addEventListener('click', () => showToast('Draft saved 💾'));

  // Choice chips
  document.addEventListener('click', e => {
    if (e.target.classList.contains('choice-chip')) {
      const group = e.target.closest('.chip-group');
      if (group) {
        group.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');
      }
    }
  });

  // Document file inputs — show selected file names
  $$('.doc-input').forEach(input => {
    input.addEventListener('change', () => {
      const status = $('#' + input.id + '-status');
      if (!status) return;
      const files = input.files;
      if (!files || !files.length) {
        status.textContent = input.multiple ? 'Choose files' : 'Choose file';
        status.className = 'doc-status pending';
        return;
      }
      status.textContent = files.length === 1
        ? files[0].name.length > 22 ? files[0].name.slice(0, 20) + '… ✓' : files[0].name + ' ✓'
        : files.length + ' files ✓';
      status.className = 'doc-status uploaded';
    });
  });

  // Search
  let searchTimeout;
  $('#search-input').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadDogs(currentFilter, e.target.value), 300);
  });

  // Filters
  $('#filter-row').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    currentFilter = chip.dataset.filter;
    $('#filter-row').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadDogs(currentFilter, $('#search-input').value);
  });

  // Shelter search/filters
  let shelterSearchTimeout;
  $('#shelter-search')?.addEventListener('input', e => {
    clearTimeout(shelterSearchTimeout);
    shelterSearchTimeout = setTimeout(() => {
      const activeFilter = $('#shelter-filters .chip.active')?.dataset.filter || 'all';
      loadShelters(activeFilter, e.target.value);
    }, 300);
  });
  $('#shelter-filters')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $('#shelter-filters').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadShelters(chip.dataset.filter, $('#shelter-search').value);
  });

  // Article filters
  $('#article-filters')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $('#article-filters').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadArticles(chip.dataset.filter);
  });

  // Notifications
  $('#notif-btn').addEventListener('click', () => { loadNotifications(); showPage('page-notifications'); });
  $('#mark-all-read').addEventListener('click', markAllRead);

  // User profile actions
  document.addEventListener('click', e => {
    const menuItem = e.target.closest('.menu-item[data-action]');
    if (!menuItem) return;
    const action = menuItem.dataset.action;
    switch (action) {
      case 'applications': switchNav(2); break;
      case 'favourites': loadFavourites(); showPage('page-favourites'); break;
      case 'volunteer': loadVolunteer(); showPage('page-volunteer'); break;
      case 'foster': switchNav(3); break;
      case 'notifications': loadNotifications(); showPage('page-notifications'); break;
      case 'edit-profile': showEditProfileModal(); break;
      case 'admin': loadAdmin(); break;
      case 'refer': showToast('Referral link copied! 🐾'); break;
      case 'help': showHelpModal(); break;
      case 'logout': logout(); break;
    }
  });

  // Volunteer link
  $('#vol-link')?.addEventListener('click', () => { loadVolunteer(); showPage('page-volunteer'); });
  $('#volunteer-back')?.addEventListener('click', goBack);

  // See all dogs
  $('#see-all-dogs')?.addEventListener('click', () => switchNav(0));

  // Adoption hero CTA — scroll to the available dogs
  $('#hero-browse-btn')?.addEventListener('click', () => {
    const grid = $('#dog-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // SOS
  $('#sos-banner')?.addEventListener('click', () => showToast('Calling emergency rescue line... 📞'));

  // Map
  $('#map-preview')?.addEventListener('click', () => switchNav(1));

  // Quiz — rotating question bank
  renderQuiz();
  document.addEventListener('click', e => {
    const opt = e.target.closest('#quiz-options .quiz-option');
    if (opt) { answerQuiz(opt); return; }
  });
  $('#quiz-next')?.addEventListener('click', () => { quizIndex++; renderQuiz(); });

  // Poll voting
  document.addEventListener('click', e => {
    const opt = e.target.closest('.poll-option');
    if (!opt) return;
    const poll = opt.closest('.poll-card');
    if (poll.classList.contains('voted')) return;
    poll.classList.add('voted');
    opt.classList.add('chosen');
    showToast('Thanks for voting! 🗳️');
  });

  // FAQ toggle
  document.addEventListener('click', e => {
    const faq = e.target.closest('.faq-item');
    if (faq) faq.classList.toggle('open');
  });

  // Foster register
  $('#foster-register-btn')?.addEventListener('click', () => showToast('Opening foster registration form... 📋'));

  // Bookmark
  $('#bookmark-btn')?.addEventListener('click', () => showToast('Article saved 🔖'));

  // Modal
  $('#modal').addEventListener('click', e => {
    if (e.target === $('#modal')) $('#modal').classList.remove('show');
  });

  // Avatar click
  $('#user-avatar').addEventListener('click', () => switchNav(5));
});

// ── Help & FAQs Modal ──
const HELP_FAQS = [
  { q: 'How does the adoption process work?', a: 'Browse dogs and open a profile, submit the adoption application with your home details and required documents, the shelter reviews within 48 hours, a short home visit or video call is scheduled, and on approval you complete the paperwork and meet your new companion. 🎉' },
  { q: 'What documents do I need to adopt?', a: 'A government ID (Aadhaar / Voter ID / Passport), address proof (utility bill or rental agreement), income proof (salary slip or bank statement), and 3-5 photos of your living space. You upload these securely in the application — JPG, PNG or PDF, up to 8 MB each.' },
  { q: 'Are my uploaded documents safe?', a: 'Yes. Documents are stored securely and are only visible to the reviewing shelter and PawFinder admin — never to other adopters. They stay on file after approval for follow-up support and re-homing safety.' },
  { q: 'How long does approval take?', a: 'Most shelters review applications within 48 hours. You can always track the live status of every application in the Adopt tab.' },
  { q: 'Is there an adoption fee?', a: 'PawFinder itself is free. Some shelters charge a small adoption fee that covers vaccination, sterilisation and deworming already done for the dog. The exact amount is confirmed by the shelter during review.' },
  { q: 'Can I foster a dog instead of adopting?', a: 'Absolutely. Fostering gives a dog a temporary home while it waits for adoption. The shelter covers food and all medical costs. Around 78% of foster parents end up adopting — see the Foster tab.' },
  { q: 'What if my application is declined?', a: 'You will get a notification with next steps. Declines are usually about finding the best match for a specific dog, not about you. Many other wonderful dogs are still waiting — please do apply again. 🐾' },
  { q: 'How do I report an injured street dog?', a: 'Tap the red "Found an injured stray?" banner on the Discover page to connect with a nearby rescue team, or call your local Coimbatore shelter directly from its profile.' },
  { q: 'How do I contact a shelter?', a: 'Open any dog or shelter profile and tap "Chat" to message the shelter directly. Each shelter profile also lists its phone number, email and visiting hours.' },
  { q: 'Still need help?', a: 'Email support@pawfinder.in or message any shelter in-app. Our volunteers are happy to guide you through every step of your adoption journey.' }
];

function showHelpModal() {
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">Help &amp; FAQs ❓</div>
    <div class="modal-sub">Answers to the most common questions about adopting with PawFinder</div>
    <div class="help-faq-list">
      ${HELP_FAQS.map(f => `
        <div class="faq-item">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>`).join('')}
    </div>
    <button class="btn-secondary" id="close-help-btn" style="margin-top:18px">Close</button>`;
  $('#modal').classList.add('show');
  $('#close-help-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
}

// ── Edit Profile Modal ──
function showEditProfileModal() {
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">Edit Profile</div>
    <div class="modal-sub">Update your information</div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div><div class="field-label">Name</div><input class="input-field" id="edit-name" value="${currentUser?.name || ''}"></div>
      <div><div class="field-label">Phone</div><input class="input-field" id="edit-phone" value="${currentUser?.phone || ''}"></div>
      <div><div class="field-label">City</div><input class="input-field" id="edit-city" value="${currentUser?.city || ''}"></div>
      <button class="btn-primary" id="save-profile-btn">Save Changes</button>
      <button class="btn-secondary" id="close-modal-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');

  $('#save-profile-btn').addEventListener('click', async () => {
    try {
      const { user } = await API.put('/api/users/profile', {
        name: $('#edit-name').value,
        phone: $('#edit-phone').value,
        city: $('#edit-city').value
      });
      currentUser = user;
      $('#modal').classList.remove('show');
      showToast('Profile updated ✓');
      loadUserProfile();
    } catch (e) { showToast('Failed to update'); }
  });
  $('#close-modal-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
}

// ── Admin Panel ──
function escAttr(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function docIcon(type) {
  return { gov_id: '🪪', address: '🏠', income: '💼', photos: '📷' }[type] || '📄';
}
function fmtSize(bytes) {
  const n = Number(bytes) || 0;
  if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  if (n >= 1024) return Math.round(n / 1024) + ' KB';
  return n + ' B';
}

async function loadAdmin() {
  if (!currentUser || !currentUser.is_admin) {
    showToast('Admin access only');
    switchNav(5);
    return;
  }
  showPage('page-admin');
  $$('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === adminTab));
  await renderAdminList();
}

function updateAdminAddBtn() {
  const btn = $('#admin-add-btn');
  if (btn) btn.style.display = adminTab === 'applications' ? 'none' : '';
}

async function renderAdminList() {
  const list = $('#admin-list');
  list.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  updateAdminAddBtn();
  try {
    if (adminTab === 'applications') {
      const qs = adminAppStatus === 'all' ? '' : `?status=${adminAppStatus}`;
      const { applications, counts } = await API.get(`/api/applications/admin/all${qs}`);
      const tabs = [
        ['all', 'All', (counts.total || 0)],
        ['pending', 'Pending', (counts.pending || 0)],
        ['approved', 'Approved', (counts.approved || 0)],
        ['rejected', 'Declined', (counts.rejected || 0)]
      ];
      const summary = `
        <div class="admin-app-summary">
          <div class="admin-app-stat pending ${adminAppStatus === 'pending' ? 'sel' : ''}" data-app-status="pending"><div class="admin-app-stat-num">${counts.pending || 0}</div><div class="admin-app-stat-label">Pending</div></div>
          <div class="admin-app-stat approved ${adminAppStatus === 'approved' ? 'sel' : ''}" data-app-status="approved"><div class="admin-app-stat-num">${counts.approved || 0}</div><div class="admin-app-stat-label">Approved</div></div>
          <div class="admin-app-stat rejected ${adminAppStatus === 'rejected' ? 'sel' : ''}" data-app-status="rejected"><div class="admin-app-stat-num">${counts.rejected || 0}</div><div class="admin-app-stat-label">Declined</div></div>
        </div>
        <div class="filter-row admin-app-filters">
          ${tabs.map(([k, lbl, n]) => `<div class="chip ${adminAppStatus === k ? 'active' : ''}" data-app-status="${k}">${lbl} (${n})</div>`).join('')}
        </div>`;
      if (!applications.length) {
        const msg = adminAppStatus === 'approved' ? 'No approved adoptions yet'
          : adminAppStatus === 'pending' ? 'No pending applications'
          : adminAppStatus === 'rejected' ? 'No declined applications'
          : 'No applications yet';
        list.innerHTML = summary + emptyAdmin('📋', msg, 'Adoption requests will appear here for review');
        return;
      }
      list.innerHTML = summary + applications.map(a => {
        const pending = a.status === 'pending';
        const docs = a.documents || [];
        const docsHtml = docs.length ? `
          <div class="admin-app-docs">
            <div class="admin-app-docs-title">📎 Submitted documents (${docs.length})</div>
            <div class="admin-app-doc-list">
              ${docs.map(d => `
                <a class="admin-doc-chip" href="/api/applications/documents/${d.id}" target="_blank" rel="noopener" title="${escAttr(d.original_name || d.label)}">
                  <span class="admin-doc-ic">${docIcon(d.doc_type)}</span>
                  <span class="admin-doc-name">${escAttr(d.label || d.doc_type)}</span>
                  <span class="admin-doc-size">${fmtSize(d.size)}</span>
                </a>`).join('')}
            </div>
          </div>` : `<div class="admin-app-docs admin-app-docs-empty">No documents were attached to this application.</div>`;
        const decidedNote = a.status === 'approved'
          ? '✓ Adoption approved — documents remain on file for follow-up'
          : 'Declined · documents retained for records';
        return `
        <div class="admin-app-card">
          <div class="admin-app-head">
            <div class="admin-app-emoji">${a.dog_emoji || '🐕'}</div>
            <div class="admin-app-info">
              <div class="admin-app-dog">${escAttr(a.dog_name)} <span class="admin-app-breed">· ${escAttr(a.dog_breed || '')}</span></div>
              <div class="admin-app-applicant">👤 ${escAttr(a.applicant_name)} · ${escAttr(a.shelter_name || 'Shelter')}</div>
            </div>
            <div class="app-status ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</div>
          </div>
          <div class="admin-app-meta">
            <div>📧 <b>${escAttr(a.applicant_email || '—')}</b></div>
            <div>📱 <b>${escAttr(a.applicant_phone || '—')}</b></div>
            <div>🏠 <b>${escAttr(a.residence_type || '—')}</b></div>
            <div>🌳 Outdoor: <b>${escAttr(a.outdoor_space || '—')}</b></div>
            <div>🎓 <b>${escAttr(a.experience || '—')}</b></div>
            <div>🐾 Pets: <b>${escAttr(a.other_pets || '—')}</b></div>
            <div>👶 Kids: <b>${escAttr(a.children || '—')}</b></div>
            <div>⏰ Alone: <b>${escAttr(a.alone_hours || '—')}</b></div>
          </div>
          ${a.reason ? `<div class="admin-app-reason">"${escAttr(a.reason)}"</div>` : ''}
          ${docsHtml}
          ${pending ? `
          <div class="admin-app-actions">
            <button class="btn-approve" data-approve="${a.id}" data-name="${escAttr(a.dog_name)}">✓ Approve adoption</button>
            <button class="btn-reject" data-reject="${a.id}" data-name="${escAttr(a.dog_name)}">Decline</button>
          </div>` : `<div class="admin-app-decided">${decidedNote}</div>`}
        </div>`;
      }).join('');
    } else if (adminTab === 'dogs') {
      const { dogs } = await API.get('/api/dogs/admin/all');
      if (!dogs.length) { list.innerHTML = emptyAdmin('🐕', 'No dogs yet', 'Tap + Add to create one'); return; }
      list.innerHTML = dogs.map(d => `
        <div class="admin-row">
          <div class="admin-row-emoji">${d.emoji || '🐕'}</div>
          <div class="admin-row-info">
            <div class="admin-row-name">${d.name} ${d.adopted ? '<span class="tag tag-blue">Adopted</span>' : ''}${d.urgent ? '<span class="tag tag-red">Urgent</span>' : ''}</div>
            <div class="admin-row-sub">${d.breed || '—'} · ${d.age_text || '—'} · ${d.shelter_name || 'No shelter'}</div>
          </div>
          <button class="admin-act edit" data-edit-dog="${d.id}">Edit</button>
          <button class="admin-act del" data-del-dog="${d.id}" data-name="${escAttr(d.name)}">Delete</button>
        </div>`).join('');
    } else {
      const { shelters } = await API.get('/api/shelters');
      if (!shelters.length) { list.innerHTML = emptyAdmin('🏥', 'No shelters yet', 'Tap + Add to create one'); return; }
      list.innerHTML = shelters.map(s => `
        <div class="admin-row">
          <div class="admin-row-emoji">${s.emoji || '🏥'}</div>
          <div class="admin-row-info">
            <div class="admin-row-name">${s.name} ${s.verified ? '<span class="tag tag-green">Verified</span>' : ''}</div>
            <div class="admin-row-sub">${s.address || '—'} · ${s.dogs_available} dogs</div>
          </div>
          <button class="admin-act edit" data-edit-shelter="${s.id}">Edit</button>
          <button class="admin-act del" data-del-shelter="${s.id}" data-name="${escAttr(s.name)}">Delete</button>
        </div>`).join('');
    }
  } catch (e) {
    list.innerHTML = emptyAdmin('⚠️', 'Could not load', e.error || 'Please try again');
  }
}

function emptyAdmin(emoji, title, sub) {
  return `<div class="empty-state"><div class="empty-emoji">${emoji}</div><div class="empty-title">${title}</div><div class="empty-sub">${sub}</div></div>`;
}

function adminField(label, name, value, type = 'text') {
  return `<div><div class="field-label">${label}</div><input class="input-field" data-f="${name}" type="${type}" value="${escAttr(value)}"></div>`;
}
function adminArea(label, name, value) {
  return `<div><div class="field-label">${label}</div><textarea class="input-field" data-f="${name}" rows="3">${escAttr(value)}</textarea></div>`;
}
function adminSelect(label, name, value, opts) {
  return `<div><div class="field-label">${label}</div><select class="input-field" data-f="${name}">${opts.map(o => `<option ${String(o) === String(value) ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
}
function adminCheck(label, name, value) {
  return `<label class="admin-check"><input type="checkbox" data-f="${name}" ${value ? 'checked' : ''}><span>${label}</span></label>`;
}

async function showDogForm(dog) {
  const d = dog || {};
  let shelters = [];
  try { shelters = (await API.get('/api/shelters')).shelters; } catch (e) {}
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">${dog ? 'Edit dog' : 'Add a dog'}</div>
    <div class="modal-sub">${dog ? escAttr(d.name) : 'Create a new adoptable dog'}</div>
    <div class="admin-form">
      ${adminField('Name *', 'name', d.name)}
      <div class="two-col">${adminField('Emoji', 'emoji', d.emoji || '🐕')}${adminField('Breed', 'breed', d.breed)}</div>
      <div class="two-col">${adminField('Age text (e.g. 2 yrs)', 'age_text', d.age_text)}${adminField('Age (months)', 'age_months', d.age_months, 'number')}</div>
      <div class="two-col">${adminSelect('Gender', 'gender', d.gender || 'Male', ['Male', 'Female'])}${adminSelect('Size', 'size', d.size || 'Medium', ['Small', 'Medium', 'Large'])}</div>
      <div class="two-col">${adminField('Weight (kg)', 'weight_kg', d.weight_kg, 'number')}${adminField('Location', 'location', d.location)}</div>
      <div><div class="field-label">Shelter</div><select class="input-field" data-f="shelter_id">${shelters.map(s => `<option value="${s.id}" ${s.id === d.shelter_id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
      ${adminArea('About', 'about', d.about)}
      <div class="two-col">${adminField('Good with', 'good_with', d.good_with)}${adminField('Energy level', 'energy_level', d.energy_level)}</div>
      <div class="two-col">${adminField('Exercise', 'exercise', d.exercise)}${adminField('Grooming', 'grooming', d.grooming)}</div>
      <div class="two-col">${adminField('Space', 'space', d.space)}${adminField('Diet', 'diet', d.diet)}</div>
      ${adminField('Traits (comma separated)', 'traits', d.traits)}
      <div class="admin-checks">
        ${adminCheck('Vaccinated', 'vaccinated', d.vaccinated)}
        ${adminCheck('Neutered', 'neutered', d.neutered)}
        ${adminCheck('Dewormed', 'dewormed', d.dewormed)}
        ${adminCheck('Microchipped', 'microchipped', d.microchipped)}
        ${adminCheck('Urgent', 'urgent', d.urgent)}
        ${adminCheck('Featured', 'featured', d.featured)}
        ${adminCheck('Adopted', 'adopted', d.adopted)}
      </div>
      <button class="btn-primary" id="admin-save-btn">${dog ? 'Save changes' : 'Create dog'}</button>
      <button class="btn-secondary" id="admin-cancel-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#admin-cancel-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#admin-save-btn').addEventListener('click', () => saveEntity('dog', dog && dog.id));
}

async function showShelterForm(shelter) {
  const s = shelter || {};
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">${shelter ? 'Edit shelter' : 'Add a shelter'}</div>
    <div class="modal-sub">${shelter ? escAttr(s.name) : 'Create a new rescue shelter'}</div>
    <div class="admin-form">
      ${adminField('Name *', 'name', s.name)}
      <div class="two-col">${adminField('Emoji', 'emoji', s.emoji || '🏥')}${adminField('City', 'city', s.city)}</div>
      ${adminField('Address', 'address', s.address)}
      <div class="two-col">${adminField('Phone', 'phone', s.phone)}${adminField('Hours', 'hours', s.hours || '9AM-5PM')}</div>
      ${adminField('Email', 'email', s.email)}
      <div class="two-col">${adminField('Distance (km)', 'distance_km', s.distance_km, 'number')}${adminField('Rating', 'rating', s.rating, 'number')}</div>
      <div class="two-col">${adminField('Dogs available', 'dogs_available', s.dogs_available, 'number')}${adminField('Dogs rehomed', 'dogs_rehomed', s.dogs_rehomed, 'number')}</div>
      ${adminField('Volunteers', 'volunteers', s.volunteers, 'number')}
      ${adminField('Tags (comma separated)', 'tags', s.tags)}
      <div class="admin-checks">${adminCheck('Verified shelter', 'verified', s.verified)}</div>
      <button class="btn-primary" id="admin-save-btn">${shelter ? 'Save changes' : 'Create shelter'}</button>
      <button class="btn-secondary" id="admin-cancel-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#admin-cancel-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#admin-save-btn').addEventListener('click', () => saveEntity('shelter', shelter && shelter.id));
}

function collectForm() {
  const data = {};
  $$('#modal-content [data-f]').forEach(el => {
    data[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
  });
  return data;
}

async function saveEntity(kind, id) {
  const data = collectForm();
  if (!data.name || !data.name.trim()) { showToast('Name is required'); return; }
  const base = kind === 'dog' ? '/api/dogs' : '/api/shelters';
  const btn = $('#admin-save-btn');
  btn.disabled = true;
  try {
    if (id) await API.put(`${base}/${id}`, data);
    else await API.post(base, data);
    $('#modal').classList.remove('show');
    showToast(`${kind === 'dog' ? 'Dog' : 'Shelter'} ${id ? 'updated' : 'created'} ✓`);
    await renderAdminList();
  } catch (e) {
    btn.disabled = false;
    showToast(e.error || 'Save failed');
  }
}

function confirmDelete(kind, id, name) {
  const m = $('#modal-content');
  m.innerHTML = `
    <div style="text-align:center;font-size:46px;margin-bottom:6px">🗑️</div>
    <div class="modal-title" style="text-align:center">Delete ${kind}?</div>
    <div class="modal-sub" style="text-align:center">"${escAttr(name)}" will be permanently removed.${kind === 'shelter' ? ' Its dogs will be kept but unassigned.' : ''}</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <button class="btn-danger" id="confirm-del-btn">Yes, delete</button>
      <button class="btn-secondary" id="cancel-del-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#cancel-del-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#confirm-del-btn').addEventListener('click', async () => {
    try {
      await API.del(`${kind === 'dog' ? '/api/dogs' : '/api/shelters'}/${id}`);
      $('#modal').classList.remove('show');
      showToast(`${kind === 'dog' ? 'Dog' : 'Shelter'} deleted`);
      await renderAdminList();
    } catch (e) { showToast(e.error || 'Delete failed'); }
  });
}

function decideApplication(id, decision, dogName) {
  const approve = decision === 'approve';
  const m = $('#modal-content');
  m.innerHTML = `
    <div style="text-align:center;font-size:46px;margin-bottom:6px">${approve ? '🎉' : '✋'}</div>
    <div class="modal-title" style="text-align:center">${approve ? 'Approve adoption?' : 'Decline application?'}</div>
    <div class="modal-sub" style="text-align:center">${approve
      ? `Approving will mark <b>${escAttr(dogName)}</b> as adopted, notify the adopter, and gently decline any other pending requests for this dog.`
      : `The applicant for <b>${escAttr(dogName)}</b> will be notified that this request can't proceed.`}</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <button class="${approve ? 'btn-primary' : 'btn-danger'}" id="confirm-decision-btn">${approve ? 'Yes, approve adoption' : 'Yes, decline'}</button>
      <button class="btn-secondary" id="cancel-decision-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#cancel-decision-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#confirm-decision-btn').addEventListener('click', async () => {
    const btn = $('#confirm-decision-btn');
    btn.disabled = true;
    try {
      await API.post(`/api/applications/${id}/decision`, { decision });
      $('#modal').classList.remove('show');
      showToast(approve ? `${dogName} adoption approved! 🎉` : 'Application declined');
      await renderAdminList();
    } catch (e) {
      btn.disabled = false;
      showToast(e.error || 'Action failed');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  $('#admin-add-btn')?.addEventListener('click', () => {
    if (adminTab === 'applications') return;
    adminTab === 'dogs' ? showDogForm(null) : showShelterForm(null);
  });
  $$('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      adminTab = tab.dataset.tab;
      $$('.admin-tab').forEach(t => t.classList.toggle('active', t === tab));
      renderAdminList();
    });
  });
  document.addEventListener('click', async e => {
    const stFilter = e.target.closest('[data-app-status]');
    if (stFilter && adminTab === 'applications') {
      const next = stFilter.dataset.appStatus;
      adminAppStatus = (adminAppStatus === next && stFilter.classList.contains('admin-app-stat')) ? 'all' : next;
      renderAdminList();
      return;
    }
    const ap = e.target.closest('[data-approve]');
    const rj = e.target.closest('[data-reject]');
    if (ap) { decideApplication(ap.dataset.approve, 'approve', ap.dataset.name); return; }
    if (rj) { decideApplication(rj.dataset.reject, 'reject', rj.dataset.name); return; }
    const ed = e.target.closest('[data-edit-dog]');
    const es = e.target.closest('[data-edit-shelter]');
    const dd = e.target.closest('[data-del-dog]');
    const ds = e.target.closest('[data-del-shelter]');
    if (ed) {
      try { const { dogs } = await API.get('/api/dogs/admin/all'); showDogForm(dogs.find(x => x.id === ed.dataset.editDog)); } catch (er) { showToast('Could not open'); }
    } else if (es) {
      try { const { shelter } = await API.get(`/api/shelters/${es.dataset.editShelter}`); showShelterForm(shelter); } catch (er) { showToast('Could not open'); }
    } else if (dd) {
      confirmDelete('dog', dd.dataset.delDog, dd.dataset.name);
    } else if (ds) {
      confirmDelete('shelter', ds.dataset.delShelter, ds.dataset.name);
    }
  });
});

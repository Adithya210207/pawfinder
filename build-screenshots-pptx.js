const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "PawFinder";
pres.title = "PawFinder — App Screenshots";

const DARK = "0D0D0F";
const GREEN = "7AE582";
const WHITE = "FFFFFF";
const GRAY = "888888";
const ssDir = path.join(__dirname, "screenshots");

const pages = [
  { file: "01-login.png",           title: "Login",                 sub: "Authentication screen with demo credentials" },
  { file: "02-register.png",        title: "Create Account",        sub: "New user registration form" },
  { file: "03-home.png",            title: "Home / Discover",       sub: "Hero banner, search, filters, featured dogs, stories & tips" },
  { file: "04-shelters.png",        title: "Shelters",              sub: "Browse 20 shelters across Coimbatore with stats & filters" },
  { file: "05-shelter-detail.png",  title: "Shelter Detail",        sub: "Individual shelter profile with contact info & stats" },
  { file: "06-applications.png",    title: "My Applications",       sub: "Track adoption application status & process overview" },
  { file: "07-foster.png",          title: "Foster a Dog",          sub: "Foster program info, dogs needing care & FAQ" },
  { file: "08-learn.png",           title: "Learn",                 sub: "Articles, stories, health guides & awareness content" },
  { file: "09-article.png",         title: "Article Reader",        sub: "Full article view with bookmarking" },
  { file: "10-volunteer.png",       title: "Volunteer",             sub: "Open roles, upcoming events & volunteer leaderboard" },
  { file: "11-profile.png",         title: "User Profile",          sub: "Badges, PawPoints, settings & account management" },
  { file: "12-notifications.png",   title: "Notifications",         sub: "Activity alerts and adoption updates" },
  { file: "13-dog-profile.png",     title: "Dog Profile",           sub: "Individual dog details with chat & adopt actions" },
  { file: "14-chat.png",            title: "Shelter Chat",          sub: "AI-assisted messaging with quick reply options" },
  { file: "15-adoption-form.png",   title: "Adoption Application",  sub: "Multi-step form with checklist & document uploads" },
  { file: "16-favourites.png",      title: "Saved Dogs",            sub: "Bookmarked dogs for later review" },
  { file: "17-admin.png",           title: "Admin Console",         sub: "Manage adoptions, dogs & shelters" },
];

// Title slide
const titleSlide = pres.addSlide();
titleSlide.background = { color: DARK };
titleSlide.addText("PawFinder", {
  x: 0.5, y: 1.5, w: 9, h: 1.2,
  fontSize: 54, fontFace: "Calibri", color: GREEN, bold: true, margin: 0
});
titleSlide.addText("App Screenshots — Full User Flow", {
  x: 0.5, y: 2.7, w: 9, h: 0.6,
  fontSize: 20, fontFace: "Calibri", color: WHITE, margin: 0
});
titleSlide.addText("17 screens covering login, discovery, adoption, fostering, learning, volunteering & admin", {
  x: 0.5, y: 3.5, w: 9, h: 0.5,
  fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0
});

// Screenshot slides
for (const page of pages) {
  const slide = pres.addSlide();
  slide.background = { color: DARK };

  // Page title
  slide.addText(page.title, {
    x: 0.4, y: 0.2, w: 6, h: 0.45,
    fontSize: 18, fontFace: "Calibri", color: GREEN, bold: true, margin: 0
  });

  // Subtitle
  slide.addText(page.sub, {
    x: 0.4, y: 0.6, w: 8, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: GRAY, margin: 0
  });

  // Screenshot image — centered, max size
  const imgPath = path.join(ssDir, page.file);
  slide.addImage({
    path: imgPath,
    x: 0.4, y: 1.0, w: 9.2, h: 4.5,
    sizing: { type: "contain", w: 9.2, h: 4.5 }
  });
}

const outPath = path.join(__dirname, "PawFinder-Screenshots.pptx");
pres.writeFile({ fileName: outPath }).then(() => {
  console.log("Created: " + outPath);
}).catch(err => {
  console.error("Error:", err);
});

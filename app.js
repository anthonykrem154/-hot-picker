/* THIS WHOLE CODE IS WRIITTEN BY ANTHHONY */
const ELO_K = 24;
const DEFAULT_ELO = 1000;
const STORAGE_KEY = "hotfinder_v2_state";

let celebs = [
  { name: "Taylor Swift", img: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png" },
  { name: "Selena Gomez", img: "https://upload.wikimedia.org/wikipedia/commons/8/81/Selena_Gomez_at_the_2024_Toronto_International_Film_Festival_10_%28cropped%29.jpg" },
  { name: "Zendaya", img: "https://upload.wikimedia.org/wikipedia/commons/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg" },
  { name: "Ariana Grande", img: "https://cdn.britannica.com/92/211792-050-E764F875/American-singer-Ariana-Grande-2018.jpg" },
  { name: "Rihanna", img: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Rihanna_Fenty_2018.png" },
  { name: "Margot Robbie", img: "https://s.yimg.com/ny/api/res/1.2/ZRHe8fKrb_gYgCmIO8zbsw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD02OTk7Y2Y9d2VicA--/https://media.zenfs.com/en-US/blogs/movie-news/a4f331a6-57da-4324-81dc-cd688394727a_wolfofwallstreet_margot_gs.jpg" },
  { name: "Emma Watson", img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Emma_Watson_2013.jpg" },
  { name: "Dua Lipa", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/DuaLipa-byPhilipRomano.jpg/960px-DuaLipa-byPhilipRomano.jpg" },
  { name: "Billie Eilish", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/BillieEilishO2160622_%2819_of_45%29_%2852153214339%29_%28cropped_3%29.jpg/960px-BillieEilishO2160622_%2819_of_45%29_%2852153214339%29_%28cropped_3%29.jpg" },
  { name: "Kylie Jenner", img: "https://people.com/thmb/TFEbUaEYTI_TozdAsgCMK3h9Uks=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(703x241:705x243)/kylie-jenner-king-kylie-101325-b1cb2ed8365a47fb948a8a0787073b86.jpg" },
  { name: "Hailey Bieber", img: "https://media.allure.com/photos/5d0fa74627e20d0462ec16ff/1:1/w_2338,h_2338,c_limit/hailey%20bieber.jpg" },
  { name: "Beyoncé", img: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg" },
  { name: "Lady Gaga", img: "https://hips.hearstapps.com/hmg-prod/images/lady-gaga-attends-the-64th-annual-grammy-awards-at-mgm-news-photo-1727455427.jpg" },
  { name: "Jennifer Lawrence", img: "https://hips.hearstapps.com/hmg-prod/images/jennifer-lawrence-attends-the-anatomie-dune-chute-red-news-photo-1704650471.jpg" },
  { name: "Natalie Portman", img: "https://m.media-amazon.com/images/M/MV5BNjk1M2RmODAtMjE0Ny00N2U0LWIwNWYtZTAxMDFiMzk1MjU5XkEyXkFqcGc@._V1_.jpg" },
  { name: "Scarlett Johansson", img: "https://m.media-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_FMjpg_UX1000_.jpg" },
  { name: "Gal Gadot", img: "https://m.media-amazon.com/images/M/MV5BNWJmNDNiMzgtOGNlOC00MmU4LThkNjUtNTIxNmQwMzQ4NTczXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { name: "Sofia Vergara", img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Sof%C3%ADa_Vergara_2019_by_Glenn_Francis.jpg" },
  { name: "Emilia Clarke", img: "https://m.media-amazon.com/images/M/MV5BNjg3OTg4MDczMl5BMl5BanBnXkFtZTgwODc0NzUwNjE@._V1_FMjpg_UX1000_.jpg" },
  { name: "Anne Hathaway", img: "https://upload.wikimedia.org/wikipedia/commons/0/03/Anne_Hathaway_at_The_Apprentice_in_NYC_03_%28cropped2%29.jpg" },
  { name: "Megan Thee Stallion", img: "https://static01.nyt.com/images/2020/03/15/magazine/15mag-megantheestallion-03/15mag-megantheestallion-03-superJumbo-v3.jpg" }
];

let roundsPlayed = 0;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function pickTwo() {
  if (celebs.length < 2) return [null, null];
  let a = Math.floor(Math.random() * celebs.length);
  let b = Math.floor(Math.random() * celebs.length);
  while (b === a) b = Math.floor(Math.random() * celebs.length);
  return [celebs[a], celebs[b]];
}

function expectedScore(a, b) {
  return 1 / (1 + Math.pow(10, (b - a) / 400));
}

function updateElo(winner, loser) {
  const Ea = expectedScore(winner.elo, loser.elo);
  const Eb = expectedScore(loser.elo, winner.elo);
  winner.elo += Math.round(ELO_K * (1 - Ea));
  loser.elo += Math.round(ELO_K * (0 - Eb));
}

function renderPair() {
  const [L, R] = pickTwo();
  if (!L || !R) return;
  $("#imgLeft").src = L.img;
  $("#imgRight").src = R.img;
  $("#nameLeft").textContent = L.name;
  $("#nameRight").textContent = R.name;
  $("#cardLeft").dataset.name = L.name;
  $("#cardRight").dataset.name = R.name;
}

function vote(side) {
  const left = celebs.find(c => c.name === $("#cardLeft").dataset.name);
  const right = celebs.find(c => c.name === $("#cardRight").dataset.name);
  if (!left || !right) return;
  const winner = side === "left" ? left : right;
  const loser = side === "left" ? right : left;
  updateElo(winner, loser);
  roundsPlayed++;
  renderPair();
}

document.addEventListener("DOMContentLoaded", () => {
  renderPair();
  $("[data-side='left']").addEventListener("click", () => vote("left"));
  $("[data-side='right']").addEventListener("click", () => vote("right"));
  $("#skipBtn").addEventListener("click", renderPair);
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") vote("left");
    if (e.key === "ArrowRight") vote("right");
  });
});

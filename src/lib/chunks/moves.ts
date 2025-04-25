export const hackAndSlash: Chunk = {
  title: "Hack and Slash",
  body: "When you attack an enemy in melee, roll+Str. On a 10+ you deal your damage to the enemy and avoid their attack. At your option, you may choose to do +1d6 damage but expose yourself to the enemy’s attack. On a 7–9, you deal your damage to the enemy and the enemy makes an attack against you.",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const volley: Chunk = {
  title: "Volley",
  body: "When you take aim and shoot at an enemy at range, roll+Dex. On a 10+ you have a clear shot—deal your damage. On a 7–9, choose one (whichever you choose you deal your damage):\n- You have to move to get the shot placing you in danger of the GM’s choice\n- You have to take what you can get: -1d6 damage\n- You have to take several shots, reducing your ammo by one.",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const defyDanger: Chunk = {
  title: "Defy Danger",
  body: "When you act despite an imminent threat or suffer a calamity, say how you deal with it and roll. If you do it…\n- by powering through, +Str\n- by getting out of the way or acting fast, +Dex\n- by enduring, +Con\n- with quick thinking, +Int\n- through mental fortitude, +Wis\n- using charm and social grace, +Cha\nOn a 10+, you do what you set out to, the threat doesn’t come to bear. On a 7–9, you stumble, hesitate, or flinch: the GM will offer you a worse outcome, hard bargain, or ugly choice.",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const defend: Chunk = {
  title: "Defend",
  body: "When you stand in defense of a person, item, or location under attack, roll+Con. On a 10+, hold 3. On a 7–9, hold 1. So long as you stand in defense, when you or the thing you defend is attacked you may spend hold, 1 for 1, to choose an option:\n- Redirect an attack from the thing you defend to yourself\n- Halve the attack’s effect or damage\n- Open up the attacker to an ally giving that ally +1 forward against the attacker\n- Deal damage to the attacker equal to your level",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const spoutLore: Chunk = {
  title: "Spout Lore",
  body: "When you consult your accumulated knowledge about something, roll+Int. On a 10+ the GM will tell you something interesting and useful about the subject relevant to your situation. On a 7–9 the GM will only tell you something interesting—it’s on you to make it useful. The GM might ask you ‘How do you know this?’ Tell them the truth, now.",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const discernRealities: Chunk = {
  title: "Discern Realities",
  body: "When you closely study a situation or person, roll+Wis. On a 10+ ask the GM 3 questions from the list below. On a 7–9 ask 1. Take +1 forward when acting on the answers.\n- What happened here recently?\n- What is about to happen?\n- What should I be on the lookout for?\n- What here is useful or valuable to me?\n- Who’s really in control here?\n- What here is not what it appears to be?",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const parley: Chunk = {
  title: "Parley",
  body: "When you have leverage on a GM character and manipulate them, roll+Cha. Leverage is something they need or want. On a hit they ask you for something and do it if you make them a promise first. On a 7–9, they need some concrete assurance of your promise, right now.",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const aidOrInterfere: Chunk = {
  title: "Aid or Interfere",
  body: "When you help or hinder someone, roll+Bond with them. On a 10+ they take +1 or -2, your choice. On a 7–9 you also expose yourself to danger, retribution, or cost.",
  category: "Basic Moves",
  type: "move",
  source: "Moves.xml",
};

export const lastBreath: Chunk = {
  title: "Last Breath",
  body: "When you’re dying you catch a glimpse of what lies beyond the Black Gates of Death’s Kingdom (the GM will describe it). Then roll (just roll, +nothing—yeah, Death doesn’t care how tough or cool you are). On a 10+ you’ve cheated death—you’re in a bad spot but you’re still alive. On a 7–9 Death will offer you a bargain. Take it and stabilize or refuse and pass beyond the Black Gates into whatever fate awaits you. On a miss, your fate is sealed. You’re marked as Death’s own and you’ll cross the threshold soon. The GM will tell you when.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const encumbrance: Chunk = {
  title: "Encumbrance",
  body: "When you make a move while carrying weight up to or equal to load, you’re fine. When you make a move while carrying weight equal to load+1 or load+2, you take -1. When you make a move while carrying weight greater than load+2, you have a choice: drop at least 1 weight and roll at -1, or automatically fail.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const makeCamp: Chunk = {
  title: "Make Camp",
  body: "When you settle in to rest consume a ration. If you’re somewhere dangerous decide the watch order as well. If you have enough XP you may Level Up. When you wake from at least a few uninterrupted hours of sleep heal damage equal to half your max HP.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const takeWatch: Chunk = {
  title: "Take Watch",
  body: "When you’re on watch and something approaches the camp roll+Wis. On a 10+ you’re able to wake the camp and prepare a response, the camp takes +1 forward. On a 7–9 you react just a moment too late; the camp is awake but hasn’t had time to prepare. You have weapons and armor but little else. On a miss whatever lurks outside the campfire’s light has the drop on you.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const undertakeAPerilousJourney: Chunk = {
  title: "Undertake a Perilous Journey",
  body: "When you travel through hostile territory, choose one member of the party to act as trailblazer, one to scout ahead, and one to be quartermaster (the same character cannot have two jobs). If you don’t have enough party members or choose not to assign a job, treat that job as if it had rolled a 6. Each character with a job to do rolls+Wis. On a 10+ the quartermaster reduces the number of rations required by one. On a 10+ the trailblazer reduces the amount of time it takes to reach your destination (the GM will say by how much). On a 10+ the scout will spot any trouble quick enough to let you get the drop on it. On a 7–9 each role performs their job as expected.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const levelUp: Chunk = {
  title: "Level Up",
  body: "When you have downtime (hours or days) and XP equal to (or greater than) your current level + 7, subtract your current level +7 from your XP, increase your level by 1, and choose a new advanced move from your class. If you are the wizard, you also get to add a new spell to your spellbook. Choose one of your stats and increase it by 1 (this may change your modifier). Changing your Constitution increases your maximum and current HP. Ability scores can’t go higher than 18.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const endOfSession: Chunk = {
  title: "End of Session",
  body: "When you reach the end of a session, choose one your bonds that you feel is resolved. Ask the player of the character you have the bond with if they agree. If they do, mark XP and write a new bond with whomever you wish. Once bonds have been updated look at your alignment. If you fulfilled that alignment at least once this session, mark XP. Then answer these three questions as a group:\n- Did we learn something new and important about the world?\n- Did we overcome a notable monster or enemy?\n- Did we loot a memorable treasure?\nFor each ‘yes’ answer everyone marks XP.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const carouse: Chunk = {
  title: "Carouse",
  body: "When you return triumphant and throw a big party, spend 100 coin and roll + extra 100s of coin spent. On a 10+ choose 3. On a 7–9 choose 1. On a miss, you still choose one, but things get really out of hand.\n- You befriend a useful NPC\n- You hear rumors of an opportunity\n- You gain useful information\n- You are not entangled, ensorcelled, or tricked",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const supply: Chunk = {
  title: "Supply",
  body: "When you go to buy something with gold on hand, if it’s something readily available in the settlement you’re in, you can buy it at market price. If it’s something special, beyond what’s usually available here, or non-mundane, roll+Cha. On a 10+ you find what you’re looking for at a fair price. On a 7–9 you’ll have to pay more or settle for something similar.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const recover: Chunk = {
  title: "Recover",
  body: "When you do nothing but rest in comfort and safety after a day of rest you recover all your HP. After three days of rest you remove one debility of your choice. If you’re under the care of a healer (magical or otherwise) you heal a debility for every two days of rest instead.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const recruit: Chunk = {
  title: "Recruit",
  body: "When you put out word that you’re looking to hire help, roll. If you make it known…\n- …that your pay is generous, take +1\n- …what you’re setting out to do, take +1\n- …that they’ll get a share of whatever you find, take +1\nIf you have a useful reputation around these parts take an additional +1. On a 10+ you’ve got your pick of a number of skilled applicants. On a 7–9 you’ll have to settle for someone close or turn them away. On a miss someone influential and ill-suited declares they’d like to come along, bring them and take the consequences or turn them away. If you turn away applicants you take -1 forward to Recruit.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const outstandingWarrants: Chunk = {
  title: "Outstanding Warrants",
  body: "When you return to a civilized place in which you’ve caused trouble before, roll+Cha. On a hit, word has spread of your deeds and everyone recognizes you. On a 7–9, that, and, the GM chooses a complication:\n- The local constabulary has a warrant out for your arrest\n- Someone has put a price on your head\n- Someone important to you has been put in a bad spot as a result of your actions",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const bolster: Chunk = {
  title: "Bolster",
  body: "When you spend your leisure time in study, meditation, or hard practice, you gain preparation. If you prepare for a week or two, 1 preparation. If you prepare for a month or longer, 3 preparation. When your preparation pays off spend 1 preparation for +1 to any roll. You can only spend one preparation per roll.",
  category: "Special Moves",
  type: "move",
  source: "Moves.xml",
};

export const theGmsAgenda: Chunk = {
  title: "The GM’s Agenda",
  body: "The GM’s agenda: portray a fantastic world, fill the characters’ lives with adventure, and play to find out what happens. These are not suggestions—they define how the GM approaches the game, keeping it vibrant, dangerous, and unexpected.",
  category: "GM Guidance",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const theGmsPrinciples: Chunk = {
  title: "The GM’s Principles",
  body: "The GM’s principles are foundational behaviors: describe honestly, address the characters, make moves, begin and end with the fiction, and more. They focus play and keep it grounded in the characters’ experience of the world.",
  category: "GM Guidance",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const whenToMakeAGmMove: Chunk = {
  title: "When to Make a GM Move",
  body: "The GM makes a move when players look to them to say something, when a player rolls a 6-, or when a golden opportunity arises. Moves are always grounded in the fiction and should follow the principles and agenda.",
  category: "GM Guidance",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const theGmMoveList: Chunk = {
  title: "The GM Move List",
  body: "The GM has a list of moves—show signs of doom, deal damage, reveal an unwelcome truth, use up resources, separate them, and others. These are narrative tools, not hard rules, and are used to keep the fiction moving in interesting directions.",
  category: "GM Guidance",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const showSignsOfAnApproachingThreat: Chunk = {
  title: "Show Signs of an Approaching Threat",
  body: "This move builds suspense. Use sounds, hints, or subtle changes to warn of upcoming danger—cracks in the wall, ominous whispers, distant drums. It's a signal, not the threat itself. Players should know something's wrong before it hits.",
  category: "GM Moves",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const dealDamage: Chunk = {
  title: "Deal Damage",
  body: "Deal damage means just that—apply the appropriate damage to a character. Use monster damage rolls, environmental threats, or consequences of failure. Damage doesn’t always mean HP loss—it could be lost gear or weakened footing if fiction fits.",
  category: "GM Moves",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const revealAnUnwelcomeTruth: Chunk = {
  title: "Reveal an Unwelcome Truth",
  body: "Reveal something the players didn’t want to be true: the bridge is already broken, the traitor is someone they trust, or the villagers are undead. It should follow logically from fiction, but still feel like a twist.",
  category: "GM Moves",
  type: "rule",
  source: "Playing_The_Game.txt",
};

export const useUpTheirResources: Chunk = {
  title: "Use Up Their Resources",
  body: "Torches burn out, rations run low, spell components get used up. This move pushes scarcity. It forces hard choices, tension, and realism. It should be tied to events in the fiction like travel, time passing, or complications.",
  category: "GM Moves",
  type: "rule",
  source: "Playing_The_Game.txt",
};

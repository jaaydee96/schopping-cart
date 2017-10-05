var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://linbox.kovopb.cz:27017/schopping', { useMongoClient: true, promiseLibrary: global.Promise });
var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Ghotic',
        description: 'Gothic is a single-player action role-playing video game for Microsoft Windows developed by the German company Piranha Bytes. It was first released in Germany on March 15, 2001, followed by the English North American release eight months later on November 23, 2001, and the Polish release on March 28, 2002. Gothic has been well received by critics, scoring an average of 80% and 81/100 on Game Rankings and Metacritic\'s aggregates, respectively.Reviewers credited the game for its story, complex interaction with other in-game characters, and graphics, but criticized it for the difficult control scheme and high system requirements.',
        price: 9.99
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/9/91/WoW_Box_Art1.jpg',
        title: 'World of Warcraft',
        description: 'World of Warcraft (WoW) is a massively multiplayer online role-playing game (MMORPG) released in 2004 by Blizzard Entertainment. It is the fourth released game set in the fantasy Warcraft universe, which was first introduced by Warcraft: Orcs & Humans in 1994.[3] World of Warcraft takes place within the Warcraft world of Azeroth, approximately four years after the events at the conclusion of Blizzard\'s previous Warcraft release, Warcraft III: The Frozen Throne.[4] Blizzard Entertainment announced World of Warcraft on September 2, 2001. The game was released on November 23, 2004, on the 10th anniversary of the Warcraft franchise.',
        price: 19.99
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Diablo_III_RoS_Cover.jpg',
        title: 'Diablo III: Reaper of Souls',
        description: 'Diablo III: Reaper of Souls is the first expansion pack for the action role-playing video game Diablo III. It was revealed at Gamescom 2013. It was released for the PC and Mac versions of Diablo III on March 25, 2014. The expansion pack content was released as part of the Diablo III: Ultimate Evil Edition version for consoles on August 19 for the PlayStation 4, Xbox One, PlayStation 3, and Xbox 360. That edition expanded the base Diablo III game on the PlayStation 3 and Xbox 360, and brought the game for the first time to the PlayStation 4 and Xbox One.',
        price: 19.99
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/3/32/Spintires_boxart.jpg',
        title: 'Spintires',
        description: 'Spintires is an off-roading simulation video game developed by Pavel Zagrebelnyj and published by the UK publisher Oovee. In Spintires, players take control of off-road vehicles and drive them through muddy off-road terrain to complete objectives. The game was released on June 13, 2014, and has since sold over 100,000 copies.',
        price: 13.99
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/7/75/Battlefield_4_cover_art.jpg',
        title: 'Battlefield 4',
        description: 'Battlefield 4 is a first-person shooter video game developed by video game developer EA DICE and published by Electronic Arts. It is a sequel to 2011\'s Battlefield 3 and was released on October 29, 2013 in North America, October 31, 2013, in Australia, November 1, 2013, in Europe and New Zealand and November 7, 2013, in Japan for Microsoft Windows, PlayStation 3, PlayStation 4, Xbox 360 and Xbox One. Battlefield 4 was met with positive reception. It was praised for its multiplayer mode, gameplay and graphics, but was also criticized for its short and shallow single-player campaign mode, and for its numerous bugs and glitches. It was a commercial success, selling over 7 million copies.',
        price: 9.99
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Battlefield_1_cover_art.jpg',
        title: 'Battlefield 1',
        description: 'Battlefield 1 is a first-person shooter video game developed by EA DICE and published by Electronic Arts. Despite its name, Battlefield 1 is the fifteenth installment in the Battlefield series, and the first main entry in the series since Battlefield 4. It was released worldwide for Microsoft Windows, PlayStation 4, and Xbox One on October 21, 2016. Battlefield 1 received positive reviews by critics and was seen as an improvement over previous installments, Battlefield 4 and Battlefield Hardline. Most of the praise was directed towards its World War I theme, multiplayer modes, visuals and sound design.',
        price: 29.99
    })
];
var done = 0;
for( var i = 0; i < products.length; i++) {

    products[i].save(function (err, result) {
        done++;
        if(done===products.length) {
            exit();
        }
    });
}
function exit() {
    mongoose.disconnect();
}

// Static Datasets for Footy-Trivia Application

            const QUESTIONS = {

        'premier-league': [
          { q: 'Which club has won the most Premier League titles?', opts: ['Manchester United', 'Chelsea', 'Arsenal', 'Liverpool'], ans: 0, cat: 'Premier League', diff: 'easy', hint: 'Sir Alex Ferguson managed this club to most of their titles.' },

          { q: 'Who is the all-time top scorer in Premier League history?', opts: ['Wayne Rooney', 'Alan Shearer', 'Andrew Cole', 'Frank Lampard'], ans: 1, cat: 'Premier League', diff: 'easy', hint: 'He played for Blackburn Rovers and Newcastle United.' },

          { q: 'In what year was the Premier League founded?', opts: ['1985', '1990', '1992', '1995'], ans: 2, cat: 'Premier League', diff: 'easy', hint: 'It replaced the old First Division.' },

          { q: 'Which stadium is home to Manchester City?', opts: ['Anfield', 'Etihad Stadium', 'Old Trafford', 'Stamford Bridge'], ans: 1, cat: 'Premier League', diff: 'easy', hint: 'Located in east Manchester.' },

          { q: 'Who scored the famous "Hand of God" goal?', opts: ['Ronaldo', 'Pele', 'Diego Maradona', 'Zinedine Zidane'], ans: 2, cat: 'World Cup', diff: 'medium', hint: 'Argentina vs England, Mexico 1986.' },

          { q: 'Which country has won the most FIFA World Cups?', opts: ['Germany', 'Argentina', 'Italy', 'Brazil'], ans: 3, cat: 'World Cup', diff: 'easy', hint: 'They have won it 5 times.' },

          { q: 'Who won the Ballon d\'Or in 2023?', opts: ['Erling Haaland', 'Kylian Mbappe', 'Lionel Messi', 'Vinicius Jr'], ans: 2, cat: 'Awards', diff: 'medium', hint: 'He won the World Cup in 2022 with his nation.' },

          { q: 'Which club did Erling Haaland join from Borussia Dortmund?', opts: ['Real Madrid', 'Chelsea', 'Manchester City', 'Bayern Munich'], ans: 2, cat: 'Transfers', diff: 'easy', hint: 'He moved to the Premier League in summer 2022.' },

          { q: 'How many times has Liverpool won the UEFA Champions League?', opts: ['5', '6', '7', '8'], ans: 1, cat: 'Champions League', diff: 'medium', hint: 'Their latest win was in 2019 vs Tottenham.' },

          { q: 'Which player holds the record for most Champions League goals?', opts: ['Lionel Messi', 'Raul', 'Robert Lewandowski', 'Cristiano Ronaldo'], ans: 3, cat: 'Champions League', diff: 'medium', hint: 'He also holds the record for most international goals.' },

          { q: 'Which team went undefeated in the 2003-04 Premier League season?', opts: ['Manchester United', 'Arsenal', 'Chelsea', 'Liverpool'], ans: 1, cat: 'Premier League', diff: 'easy', hint: 'The Invincibles.' },

          { q: 'What is the record transfer fee paid by a Premier League club?', opts: ['£100m', '£105m', '£115m', '£121m'], ans: 3, cat: 'Premier League', diff: 'hard', hint: 'Enzo Fernandez and Moises Caicedo transfers.' },

          { q: 'Which stadium has the largest capacity in the Premier League?', opts: ['Emirates Stadium', 'Tottenham Hotspur Stadium', 'Old Trafford', 'London Stadium'], ans: 2, cat: 'Premier League', diff: 'medium', hint: 'Capacity is over 74,000.' },

          { q: 'Who was the first manager to win three consecutive Premier League titles?', opts: ['Arsene Wenger', 'Sir Alex Ferguson', 'Jose Mourinho', 'Pep Guardiola'], ans: 1, cat: 'Premier League', diff: 'medium', hint: 'Achieved with Manchester United.' },

          { q: 'Which club holds the record for the lowest points total in a Premier League season?', opts: ['Sunderland', 'Derby County', 'Aston Villa', 'Huddersfield Town'], ans: 1, cat: 'Premier League', diff: 'hard', hint: '11 points in the 2007-08 season.' },

          { q: 'In 2012, who scored the 93rd-minute goal to win Manchester City their first Premier League title?', opts: ['David Silva', 'Yaya Toure', 'Sergio Aguero', 'Mario Balotelli'], ans: 2, cat: 'Premier League', diff: 'easy', hint: '"AGUEROOOOO!"' },

          { q: 'Who holds the record for the fastest Premier League hat-trick?', opts: ['Robbie Fowler', 'Sadio Mane', 'Alan Shearer', 'Sergio Aguero'], ans: 1, cat: 'Premier League', diff: 'hard', hint: '2 minutes 56 seconds for Southampton vs Aston Villa.' },

          { q: 'Which team won the Premier League in the 2015-16 season in a historic sports upset?', opts: ['Leicester City', 'Tottenham Hotspur', 'West Ham', 'Everton'], ans: 0, cat: 'Premier League', diff: 'easy', hint: 'Managed by Claudio Ranieri.' },

          { q: 'Who has made the most appearances in Premier League history?', opts: ['Ryan Giggs', 'Gareth Barry', 'Frank Lampard', 'James Milner'], ans: 1, cat: 'Premier League', diff: 'medium', hint: '653 appearances.' },

          { q: 'Which player has the most Premier League assists of all time?', opts: ['Cesc Fabregas', 'Wayne Rooney', 'Ryan Giggs', 'Kevin De Bruyne'], ans: 2, cat: 'Premier League', diff: 'medium', hint: '162 assists.' },

          { q: 'What controversy occurred in 2019 in the Tottenham vs Manchester City Champions League quarterfinal involving VAR?', opts: ['Sterling goal disallowed', 'Llorente handball', 'Both of these', 'None of these'], ans: 2, cat: 'Premier League', diff: 'hard', hint: 'Late drama at the Etihad Stadium.' },

          { q: 'Which club did Jack Grealish join for £100m in 2021?', opts: ['Manchester United', 'Manchester City', 'Chelsea', 'Liverpool'], ans: 1, cat: 'Premier League', diff: 'easy', hint: 'Transferred from Aston Villa.' },

          { q: 'Who is the youngest player to make a Premier League appearance?', opts: ['Harvey Elliott', 'Ethan Nwaneri', 'Wayne Rooney', 'Cesc Fabregas'], ans: 1, cat: 'Premier League', diff: 'hard', hint: '15 years and 181 days for Arsenal in 2022.' },

          { q: 'Which manager won the Premier League with two different clubs?', opts: ['Sir Alex Ferguson', 'Kenny Dalglish', 'Jose Mourinho', 'Pep Guardiola'], ans: 1, cat: 'Premier League', diff: 'hard', hint: 'Blackburn Rovers and Liverpool.' },

          { q: 'Who was the first player to score 30+ goals in a 38-game Premier League season?', opts: ['Alan Shearer', 'Andy Cole', 'Cristiano Ronaldo', 'Mohamed Salah'], ans: 2, cat: 'Premier League', diff: 'hard', hint: 'Manchester United winger in 2007-08.' },

          { q: 'Who has won the most Premier League Manager of the Month awards?', opts: ['Sir Alex Ferguson', 'Arsene Wenger', 'Jose Mourinho', 'Pep Guardiola'], ans: 0, cat: 'Premier League', diff: 'medium', hint: 'He managed Manchester United for over two decades.' },

          { q: 'Which club won the Premier League title in the 1994-95 season?', opts: ['Manchester United', 'Blackburn Rovers', 'Arsenal', 'Leeds United'], ans: 1, cat: 'Premier League', diff: 'easy', hint: 'Led by Alan Shearer up front.' },

          { q: 'Which player scored the first-ever Premier League goal in 1992?', opts: ['Teddy Sheringham', 'Alan Shearer', 'Brian Deane', 'Eric Cantona'], ans: 2, cat: 'Premier League', diff: 'hard', hint: 'He scored it for Sheffield United against Manchester United.' },

          { q: 'Which player has scored the most penalties in Premier League history?', opts: ['Frank Lampard', 'Alan Shearer', 'Steven Gerrard', 'Harry Kane'], ans: 1, cat: 'Premier League', diff: 'medium', hint: 'He is also the all-time top scorer.' },

          { q: 'Who holds the record for most clean sheets in Premier League history?', opts: ['David James', 'Petr Cech', 'Mark Schwarzer', 'David De Gea'], ans: 1, cat: 'Premier League', diff: 'medium', hint: 'He played for Chelsea and Arsenal, keeping 202 clean sheets.' },

          { q: 'Which club holds the record for the most points in a single Premier League season?', opts: ['Liverpool', 'Chelsea', 'Manchester City', 'Manchester United'], ans: 2, cat: 'Premier League', diff: 'easy', hint: 'They achieved 100 points in the 2017-18 season.' }
        ],

        'la-liga': [
          { q: 'Which club has won the most La Liga titles?', opts: ['FC Barcelona', 'Real Madrid', 'Atletico Madrid', 'Valencia'], ans: 1, cat: 'La Liga', diff: 'easy', hint: 'Los Blancos, the white ones.' },

          { q: 'Who is La Liga\'s all-time top scorer?', opts: ['Ronaldo Nazario', 'Lionel Messi', 'Karim Benzema', 'Raul'], ans: 1, cat: 'La Liga', diff: 'medium', hint: 'An Argentine, usually wearing #10.' },

          { q: 'Which stadium hosts El Clasico at home for Real Madrid?', opts: ['Camp Nou', 'Vicente Calderon', 'Metropolitano', 'Santiago Bernabeu'], ans: 3, cat: 'La Liga', diff: 'easy', hint: 'Located in Madrid.' },

          { q: 'What year did Barcelona complete the historic treble?', opts: ['2006', '2009', '2011', '2015'], ans: 1, cat: 'La Liga', diff: 'medium', hint: 'Pep Guardiola\'s first season as manager.' },

          { q: 'Which player won the Golden Boot at the 2022 World Cup?', opts: ['Messi', 'Mbappe', 'Giroud', 'Alvarez'], ans: 1, cat: 'World Cup', diff: 'medium', hint: 'He scored 8 goals in the tournament.' },

          { q: 'What is the home stadium of Atletico Madrid?', opts: ['San Mames', 'Mestalla', 'Metropolitano', 'Ramon Sanchez Pizjuan'], ans: 2, cat: 'La Liga', diff: 'easy', hint: 'Replaced the Vicente Calderon.' },

          { q: 'Which player won the Pichichi Trophy (top scorer) most times?', opts: ['Lionel Messi', 'Telmo Zarra', 'Alfredo Di Stefano', 'Hugo Sanchez'], ans: 0, cat: 'La Liga', diff: 'medium', hint: 'He won it 8 times.' },

          { q: 'What is the record transfer fee paid by Real Madrid?', opts: ['£80m', '£85m', '£100m', '£115m'], ans: 3, cat: 'La Liga', diff: 'hard', hint: 'Eden Hazard transfer from Chelsea.' },

          { q: 'Who was the manager of Real Madrid when they won "La Decima" in 2014?', opts: ['Zinedine Zidane', 'Jose Mourinho', 'Carlo Ancelotti', 'Rafael Benitez'], ans: 2, cat: 'La Liga', diff: 'medium', hint: 'Italian legendary manager.' },

          { q: 'Which club did Antoine Griezmann join Barcelona from in 2019?', opts: ['Atletico Madrid', 'Real Sociedad', 'Monaco', 'Lyon'], ans: 0, cat: 'La Liga', diff: 'easy', hint: 'He returned to the same club later.' },

          { q: 'Who is the youngest scorer in El Clasico history?', opts: ['Ansu Fati', 'Lamine Yamal', 'Raul', 'Lionel Messi'], ans: 1, cat: 'La Liga', diff: 'medium', hint: 'Scored in 2023 at age 16.' },

          { q: 'Which manager won the La Liga title with Atletico Madrid in both 2014 and 2021?', opts: ['Luis Aragones', 'Diego Simeone', 'Radomir Antic', 'Quique Sanchez Flores'], ans: 1, cat: 'La Liga', diff: 'easy', hint: '"El Cholo".' },

          { q: 'Which club is known as the "Los Che"?', opts: ['Sevilla', 'Valencia', 'Real Betis', 'Athletic Bilbao'], ans: 1, cat: 'La Liga', diff: 'hard', hint: 'They play at Mestalla.' },

          { q: 'Which player has the most appearances in La Liga history?', opts: ['Andoni Zubizarreta', 'Joaquin', 'Raul', 'Lionel Messi'], ans: 0, cat: 'La Liga', diff: 'hard', hint: 'Spanish goalkeeper with 622 appearances.' },

          { q: 'Who scored the fastest goal in La Liga history?', opts: ['Lionel Messi', 'Seydou Keita', 'Joseba Llorente', 'Karim Benzema'], ans: 2, cat: 'La Liga', diff: 'hard', hint: '7.82 seconds for Real Valladolid in 2008.' },

          { q: 'What is the capacity of Barcelona\'s Camp Nou stadium before recent renovations?', opts: ['8', '00', '9', '00', '9', '54', '10', '00'], ans: 2, cat: 'La Liga', diff: 'medium', hint: 'Largest stadium in Europe.' },

          { q: 'Which team is the only non-relegated team in La Liga alongside Real Madrid and Barcelona?', opts: ['Atletico Madrid', 'Valencia', 'Athletic Bilbao', 'Sevilla'], ans: 2, cat: 'La Liga', diff: 'hard', hint: 'Basque club with a home-grown only policy.' },

          { q: 'Who holds the record for most assists in a single La Liga season?', opts: ['Xavi', 'Andres Iniesta', 'Lionel Messi', 'Mesut Ozil'], ans: 2, cat: 'La Liga', diff: 'hard', hint: '21 assists in 2019-20.' },

          { q: 'Which La Liga stadium is famous for its unique structure built next to a river?', opts: ['Mestalla', 'San Mames', 'Ramon Sanchez Pizjuan', 'Estadio de la Ceramica'], ans: 1, cat: 'La Liga', diff: 'hard', hint: 'Located in Bilbao.' },

          { q: 'In 2020, which team was relegated from La Liga after 26 years in the top flight?', opts: ['Espanyol', 'Deportivo La Coruna', 'Zaragoza', 'Malaga'], ans: 0, cat: 'La Liga', diff: 'hard', hint: 'Barcelona-based club.' },

          { q: 'Which club won the La Liga title in the 1999-2000 season?', opts: ['Real Madrid', 'Barcelona', 'Deportivo La Coruña', 'Valencia'], ans: 2, cat: 'La Liga', diff: 'hard', hint: 'Galician club\'s only league title.' },

          { q: 'Who is Real Madrid\'s second all-time leading goalscorer in La Liga?', opts: ['Raul', 'Karim Benzema', 'Alfredo Di Stefano', 'Hugo Sanchez'], ans: 1, cat: 'La Liga', diff: 'medium', hint: 'French striker who won the Ballon d\'Or in 2022.' },

          { q: 'Which club is nicknamed \'Los Armeros\' (The Gunsmiths)?', opts: ['Eibar', 'Getafe', 'Alaves', 'Osasuna'], ans: 0, cat: 'La Liga', diff: 'hard', hint: 'Basque club known for its small stadium Ipurua.' },

          { q: 'Who is Barcelona\'s all-time leading appearance maker?', opts: ['Xavi', 'Lionel Messi', 'Andres Iniesta', 'Sergio Busquets'], ans: 1, cat: 'La Liga', diff: 'medium', hint: 'He made 778 appearances for the club.' },

          { q: 'Which team has won the Copa del Rey the most times?', opts: ['Real Madrid', 'Athletic Bilbao', 'Barcelona', 'Atletico Madrid'], ans: 2, cat: 'La Liga', diff: 'medium', hint: 'They have won it 31 times.' },

          { q: 'Which city hosts the Derby del Turia?', opts: ['Seville', 'Valencia', 'Barcelona', 'Madrid'], ans: 1, cat: 'La Liga', diff: 'hard', hint: 'Contested between Valencia and Levante.' },

          { q: 'Who was the top scorer in La Liga for the 2023-24 season?', opts: ['Jude Bellingham', 'Artem Dovbyk', 'Robert Lewandowski', 'Alexander Sorloth'], ans: 1, cat: 'La Liga', diff: 'medium', hint: 'Ukrainian striker who played for Girona.' },

          { q: 'Which club plays their home games at the San Mames stadium?', opts: ['Real Sociedad', 'Athletic Bilbao', 'Osasuna', 'Celta Vigo'], ans: 1, cat: 'La Liga', diff: 'easy', hint: 'They only sign players from the Basque country.' }
        ],

        'ucl': [
          { q: 'Which club has won the most Champions League titles?', opts: ['AC Milan', 'Bayern Munich', 'Barcelona', 'Real Madrid'], ans: 3, cat: 'Champions League', diff: 'easy', hint: 'Los Blancos have 15 titles.' },

          { q: 'Where was the 2023 Champions League final held?', opts: ['Wembley', 'Ataturk', 'Lusail', 'Olympiastadion'], ans: 1, cat: 'Champions League', diff: 'medium', hint: 'Istanbul, Turkey.' },

          { q: 'Who scored the winning goal in the 2005 final comeback by Liverpool?', opts: ['Steven Gerrard', 'Jerzy Dudek (saved)', 'Andriy Shevchenko', 'Vladimir Šmicer'], ans: 1, cat: 'Champions League', diff: 'hard', hint: 'A penalty save in the shootout.' },

          { q: 'Which player has won the most Champions League titles?', opts: ['Cristiano Ronaldo', 'Iker Casillas', 'Karim Benzema', 'Luka Modrić'], ans: 3, cat: 'Champions League', diff: 'hard', hint: 'Real Madrid midfielder, won it 6 times.' },

          { q: 'What is the UEFA Champions League anthem called?', opts: ['Hymn to Joy', 'March of the Champions', 'The Anthem', 'Champions League Theme'], ans: 3, cat: 'Champions League', diff: 'easy', hint: 'Simply named after the competition.' },

          { q: 'Which club did Chelsea defeat in the 2012 Champions League final to win their first title?', opts: ['Bayern Munich', 'Barcelona', 'Manchester United', 'Real Madrid'], ans: 0, cat: 'Champions League', diff: 'easy', hint: 'Final was played at Allianz Arena.' },

          { q: 'Who is the youngest goalscorer in Champions League history?', opts: ['Kylian Mbappe', 'Ansu Fati', 'Erling Haaland', 'Raul'], ans: 1, cat: 'Champions League', diff: 'medium', hint: '17 years and 40 days for Barcelona in 2019.' },

          { q: 'Which manager has won the most Champions League trophies?', opts: ['Sir Alex Ferguson', 'Pep Guardiola', 'Carlo Ancelotti', 'Zinedine Zidane'], ans: 2, cat: 'Champions League', diff: 'medium', hint: 'He won 5 titles.' },

          { q: 'In 2021, when was the Away Goals Rule officially abolished in Champions League matches?', opts: ['2019-20', '2020-21', '2021-22', '2022-23'], ans: 2, cat: 'Champions League', diff: 'hard', hint: 'Starting from the 2021-22 season.' },

          { q: 'Who holds the record for the fastest goal scored in a Champions League final?', opts: ['Paolo Maldini', 'Zinedine Zidane', 'Lionel Messi', 'Cristiano Ronaldo'], ans: 0, cat: 'Champions League', diff: 'hard', hint: '51 seconds in the 2005 final.' },

          { q: 'Which country has produced the most Champions League winners?', opts: ['England', 'Italy', 'Spain', 'Germany'], ans: 2, cat: 'Champions League', diff: 'medium', hint: 'Real Madrid and Barcelona dominate.' },

          { q: 'Which player scored the famous overhead kick goal in the 2018 final?', opts: ['Cristiano Ronaldo', 'Gareth Bale', 'Karim Benzema', 'Sadio Mane'], ans: 1, cat: 'Champions League', diff: 'easy', hint: 'Real Madrid vs Liverpool.' },

          { q: 'How many Champions League titles did Pep Guardiola win as Barcelona manager?', opts: ['1', '2', '3', '4'], ans: 1, cat: 'Champions League', diff: 'medium', hint: 'Won in 2009 and 2011.' },

          { q: 'Who is the only player to score hat-tricks for three different Champions League clubs?', opts: ['Cristiano Ronaldo', 'Neymar', 'Robert Lewandowski', 'Zlatan Ibrahimovic'], ans: 2, cat: 'Champions League', diff: 'hard', hint: 'Dortmund, Bayern, and Barcelona.' },

          { q: 'Which club won three consecutive Champions League trophies from 2016 to 2018?', opts: ['Bayern Munich', 'Real Madrid', 'Barcelona', 'Juventus'], ans: 1, cat: 'Champions League', diff: 'easy', hint: 'Managed by Zinedine Zidane.' },

          { q: 'What capacity does Wembley Stadium hold for a Champions League final?', opts: ['7', '00', '8', '00', '8', '00', '9', '00'], ans: 3, cat: 'Champions League', diff: 'medium', hint: 'Largest stadium in the UK.' },

          { q: 'Which manager won the Champions League with Porto in 2004?', opts: ['Jose Mourinho', 'Bobby Robson', 'Andre Villas-Boas', 'Carlo Ancelotti'], ans: 0, cat: 'Champions League', diff: 'easy', hint: '"The Special One".' },

          { q: 'Who is the all-time leading assist provider in Champions League history?', opts: ['Lionel Messi', 'Cristiano Ronaldo', 'Ryan Giggs', 'Angel Di Maria'], ans: 1, cat: 'Champions League', diff: 'hard', hint: 'Same player who is the all-time top scorer.' },

          { q: 'Which club did Arsenal lose to in their only Champions League final appearance in 2006?', opts: ['Barcelona', 'Real Madrid', 'Milan', 'Bayern Munich'], ans: 0, cat: 'Champions League', diff: 'easy', hint: 'Played in Paris.' },

          { q: 'In what year was the European Cup rebranded as the UEFA Champions League?', opts: ['1990', '1992', '1994', '1996'], ans: 1, cat: 'Champions League', diff: 'medium', hint: 'Rebranded in 1992.' },

          { q: 'Which team is the only one to win the Champions League three times in a row in the modern era?', opts: ['Barcelona', 'Bayern Munich', 'AC Milan', 'Real Madrid'], ans: 3, cat: 'Champions League', diff: 'easy', hint: 'Won it in 2016, 2017, and 2018.' },

          { q: 'Who scored the winning goal in the 2020 Champions League final between PSG and Bayern?', opts: ['Kingsley Coman', 'Robert Lewandowski', 'Thomas Muller', 'Serge Gnabry'], ans: 0, cat: 'Champions League', diff: 'medium', hint: 'Former PSG youth academy player.' },

          { q: 'Which club won the Champions League in 1999 with two injury-time goals?', opts: ['Real Madrid', 'Bayern Munich', 'Manchester United', 'Juventus'], ans: 2, cat: 'Champions League', diff: 'easy', hint: 'Sheringham and Solskjaer scored in the final minutes.' },

          { q: 'Who is the youngest manager to win the UEFA Champions League?', opts: ['Jose Mourinho', 'Pep Guardiola', 'Julian Nagelsmann', 'Zinedine Zidane'], ans: 1, cat: 'Champions League', diff: 'medium', hint: 'Won it with Barcelona in 2009 at age 38.' },

          { q: 'Which club did Jose Mourinho win his second Champions League title with in 2010?', opts: ['Porto', 'Chelsea', 'Real Madrid', 'Inter Milan'], ans: 3, cat: 'Champions League', diff: 'easy', hint: 'Part of a historic treble for the Italian giants.' }
        ],

        'world-cup': [
          { q: 'Which country hosted the 2022 FIFA World Cup?', opts: ['Saudi Arabia', 'UAE', 'Qatar', 'Bahrain'], ans: 2, cat: 'World Cup', diff: 'easy', hint: 'First Middle Eastern host.' },

          { q: 'Who is the all-time top scorer at FIFA World Cups?', opts: ['Pele', 'Ronaldo Nazario', 'Miroslav Klose', 'Gerd Muller'], ans: 2, cat: 'World Cup', diff: 'medium', hint: 'German striker, 16 World Cup goals.' },

          { q: 'Which team won the first ever FIFA World Cup in 1930?', opts: ['Brazil', 'Argentina', 'Uruguay', 'Italy'], ans: 2, cat: 'World Cup', diff: 'medium', hint: 'They hosted it too.' },

          { q: 'What is the maximum number of goals scored in a single World Cup game?', opts: ['9', '10', '11', '12'], ans: 3, cat: 'World Cup', diff: 'hard', hint: 'Austria 7-5 Switzerland, 1954.' },

          { q: 'Which country has appeared in the most World Cup finals?', opts: ['Germany', 'Brazil', 'Italy', 'Argentina'], ans: 0, cat: 'World Cup', diff: 'hard', hint: '8 finals.' },

          { q: 'Who won the Golden Boot at the 2018 FIFA World Cup in Russia?', opts: ['Kylian Mbappe', 'Antoine Griezmann', 'Luka Modric', 'Harry Kane'], ans: 3, cat: 'World Cup', diff: 'medium', hint: 'English captain scored 6 goals.' },

          { q: 'Which nation has won the most FIFA World Cup tournaments?', opts: ['Germany', 'Italy', 'Brazil', 'Argentina'], ans: 2, cat: 'World Cup', diff: 'easy', hint: '5 times winners.' },

          { q: 'Who scored the winning goal for Spain in the 2010 World Cup final?', opts: ['Xavi', 'Andres Iniesta', 'David Villa', 'Iker Casillas'], ans: 1, cat: 'World Cup', diff: 'easy', hint: 'Midfielder scored in the 116th minute.' },

          { q: 'What was the capacity of Lusail Iconic Stadium for the 2022 World Cup Final?', opts: ['7', '00', '8', '00', '8', '66', '9', '00'], ans: 2, cat: 'World Cup', diff: 'hard', hint: 'Capacity was just under 89,000.' },

          { q: 'Which manager won the World Cup both as a player and as a manager?', opts: ['Didier Deschamps', 'Franz Beckenbauer', 'Mario Zagallo', 'All of these'], ans: 3, cat: 'World Cup', diff: 'hard', hint: 'All three achieved this feat.' },

          { q: 'Which player has won the most FIFA World Cup trophies?', opts: ['Pele', 'Diego Maradona', 'Cafu', 'Ronaldo Nazario'], ans: 0, cat: 'World Cup', diff: 'medium', hint: 'Won it 3 times (1958, 1962, 1970).' },

          { q: 'What year did France win their first World Cup title?', opts: ['1982', '1990', '1998', '2006'], ans: 2, cat: 'World Cup', diff: 'easy', hint: 'They hosted it that year.' },

          { q: 'Who was the youngest player to score in a World Cup final?', opts: ['Pele', 'Kylian Mbappe', 'Lionel Messi', 'Ronaldo'], ans: 0, cat: 'World Cup', diff: 'hard', hint: '17 years old in 1958.' },

          { q: 'Which goalkeeper won the Golden Glove at the 2022 World Cup?', opts: ['Hugo Lloris', 'Emiliano Martinez', 'Yassine Bounou', 'Dominik Livakovic'], ans: 1, cat: 'World Cup', diff: 'easy', hint: 'Argentina shot stopper.' },

          { q: 'Which team was infamously defeated 7-1 by Germany in the 2014 World Cup semi-finals?', opts: ['Argentina', 'Brazil', 'Netherlands', 'Colombia'], ans: 1, cat: 'World Cup', diff: 'easy', hint: 'The host nation.' },

          { q: 'What is the record number of red cards shown in a single World Cup match?', opts: ['3', '4', '5', '6'], ans: 1, cat: 'World Cup', diff: 'hard', hint: 'Battle of Nuremberg (Portugal vs Netherlands, 2006).' },

          { q: 'Which player holds the record for most World Cup appearances?', opts: ['Lothar Matthaus', 'Lionel Messi', 'Miroslav Klose', 'Cristiano Ronaldo'], ans: 1, cat: 'World Cup', diff: 'medium', hint: 'Reached 26 appearances in 2022.' },

          { q: 'Who is the only player to score in four different World Cup tournaments?', opts: ['Cristiano Ronaldo', 'Pele', 'Uwe Seeler', 'All of these'], ans: 3, cat: 'World Cup', diff: 'hard', hint: 'All three did so.' },

          { q: 'Which African nation became the first to reach a World Cup semi-final in 2022?', opts: ['Cameroon', 'Senegal', 'Morocco', 'Ghana'], ans: 2, cat: 'World Cup', diff: 'easy', hint: 'Defeated Portugal in the QF.' },

          { q: 'Which country has hosted the World Cup twice?', opts: ['Mexico', 'Italy', 'France', 'All of these'], ans: 3, cat: 'World Cup', diff: 'hard', hint: 'All three nations have hosted twice.' },

          { q: 'Which player has played the most matches in World Cup history?', opts: ['Lothar Matthaus', 'Miroslav Klose', 'Lionel Messi', 'Paolo Maldini'], ans: 2, cat: 'World Cup', diff: 'medium', hint: 'He reached 26 matches in Qatar 2022.' },

          { q: 'Which country is the only one to have played in every single FIFA World Cup?', opts: ['Germany', 'Italy', 'Argentina', 'Brazil'], ans: 3, cat: 'World Cup', diff: 'easy', hint: 'They have also won the most titles.' },

          { q: 'Who scored the fastest goal in FIFA World Cup history?', opts: ['Hakan Sukur', 'Clint Dempsey', 'Bryan Robson', 'Bernard Lacombe'], ans: 0, cat: 'World Cup', diff: 'hard', hint: 'Scored in 11 seconds against South Korea in 2002.' },

          { q: 'Which team won the 2010 FIFA World Cup?', opts: ['Germany', 'Netherlands', 'Spain', 'Argentina'], ans: 2, cat: 'World Cup', diff: 'easy', hint: 'Defeated the Netherlands 1-0 in the final.' },

          { q: 'Which nation did Croatia beat in the semi-finals to reach the 2018 World Cup final?', opts: ['England', 'Russia', 'Denmark', 'Argentina'], ans: 0, cat: 'World Cup', diff: 'easy', hint: 'Won 2-1 after extra time.' }
        ],

        'daily': [
          { q: 'Which English club is known as "The Gunners"?', opts: ['Chelsea', 'Arsenal', 'West Ham', 'Tottenham'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'They play at the Emirates Stadium.' },

          { q: 'Kylian Mbappe is from which country?', opts: ['Belgium', 'Senegal', 'France', 'Algeria'], ans: 2, cat: 'Daily Challenge', diff: 'easy', hint: 'Les Bleus.' },

          { q: 'Which position does Thibaut Courtois play?', opts: ['Midfielder', 'Striker', 'Defender', 'Goalkeeper'], ans: 3, cat: 'Daily Challenge', diff: 'easy', hint: 'Belgian international.' },

          { q: 'Who managed Barcelona during their 2008-2012 golden era?', opts: ['Luis Enrique', 'Tito Vilanova', 'Pep Guardiola', 'Johan Cruyff'], ans: 2, cat: 'Daily Challenge', diff: 'medium', hint: 'Now manages Manchester City.' },

          { q: 'What is the nickname of Borussia Dortmund?', opts: ['Die Roten', 'Die Gelben', 'BVB', 'Die Schwarzgelben'], ans: 3, cat: 'Daily Challenge', diff: 'medium', hint: 'Black and Yellow.' },

          { q: 'Which country does Robert Lewandowski represent?', opts: ['Czech Republic', 'Hungary', 'Poland', 'Slovakia'], ans: 2, cat: 'Daily Challenge', diff: 'easy', hint: 'He plays in La Liga.' },

          { q: 'How many players are on each side in a standard football match?', opts: ['9', '10', '11', '12'], ans: 2, cat: 'Daily Challenge', diff: 'easy', hint: 'Including the goalkeeper.' },

          { q: 'In what year did Zinedine Zidane retire?', opts: ['2004', '2006', '2008', '2010'], ans: 1, cat: 'Daily Challenge', diff: 'medium', hint: 'Infamously retired after the 2006 World Cup.' },

          { q: 'Which club has the record for the most Premier League wins in a season?', opts: ['Arsenal', 'Liverpool', 'Chelsea', 'Manchester City'], ans: 3, cat: 'Daily Challenge', diff: 'medium', hint: '2017-18, 32 wins.' },

          { q: 'Who won the 2022 Ballon d\'Or?', opts: ['Benzema', 'Haaland', 'Mbappe', 'Messi'], ans: 0, cat: 'Daily Challenge', diff: 'medium', hint: 'French striker.' },

          { q: 'Which nation won the 2023 FIFA Women\'s World Cup?', opts: ['England', 'USA', 'Spain', 'Sweden'], ans: 2, cat: 'Daily Challenge', diff: 'medium', hint: 'Defeated England in the final.' },

          { q: 'Which club did Jude Bellingham join Real Madrid from?', opts: ['Borussia Dortmund', 'Birmingham City', 'Manchester City', 'Liverpool'], ans: 0, cat: 'Daily Challenge', diff: 'easy', hint: 'German club.' },

          { q: 'Which manager won the Champions League with Inter Milan in 2010?', opts: ['Jose Mourinho', 'Roberto Mancini', 'Rafa Benitez', 'Pep Guardiola'], ans: 0, cat: 'Daily Challenge', diff: 'medium', hint: 'Part of a historic treble.' },

          { q: 'Who holds the record for most Ballon d\'Or awards?', opts: ['Cristiano Ronaldo', 'Michel Platini', 'Johan Cruyff', 'Lionel Messi'], ans: 3, cat: 'Daily Challenge', diff: 'medium', hint: 'Has won it 8 times.' },

          { q: 'Which player is nicknamed \'The Egyptian King\'?', opts: ['Mohamed Elneny', 'Mohamed Salah', 'Mostafa Mohamed', 'Trézéguet'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'Winger playing for Liverpool.' },

          { q: 'Which club plays at the Allianz Arena?', opts: ['Borussia Dortmund', 'Bayern Munich', 'RB Leipzig', 'Bayer Leverkusen'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'German powerhouse based in Munich.' },

          { q: 'Which country won the UEFA Euro 2024 tournament?', opts: ['England', 'France', 'Spain', 'Germany'], ans: 2, cat: 'Daily Challenge', diff: 'easy', hint: 'Defeated England 2-1 in the final.' },

          { q: 'Who won the Ballon d\'Or in 2007 before the Messi-Ronaldo era began?', opts: ['Kaka', 'Ronaldinho', 'Thierry Henry', 'Fabio Cannavaro'], ans: 0, cat: 'Daily Challenge', diff: 'medium', hint: 'AC Milan playmaker.' },

          { q: 'Which club did Neymar join PSG from in a world record transfer?', opts: ['Santos', 'Barcelona', 'Real Madrid', 'Monaco'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'Moved for €222 million in 2017.' },

          { q: 'Who is the all-time top scorer for the England national team?', opts: ['Wayne Rooney', 'Harry Kane', 'Bobby Charlton', 'Gary Lineker'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'Currently plays in the Bundesliga.' },

          { q: 'Which country hosted the 2014 FIFA World Cup?', opts: ['South Africa', 'Brazil', 'Russia', 'Germany'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'Germany won the tournament there.' },

          { q: 'What is the home stadium of Juventus?', opts: ['San Siro', 'Allianz Stadium', 'Stadio Olimpico', 'Diego Armando Maradona Stadium'], ans: 1, cat: 'Daily Challenge', diff: 'easy', hint: 'Located in Turin.' },

          { q: 'Who won the Ballon d\'Or in 2018, breaking the Messi-Ronaldo dominance?', opts: ['Luka Modric', 'Antoine Griezmann', 'Kylian Mbappe', 'Cristiano Ronaldo'], ans: 0, cat: 'Daily Challenge', diff: 'easy', hint: 'Real Madrid and Croatia midfielder.' },

          { q: 'Which team is nicknamed \'The Red Devils\' in England?', opts: ['Liverpool', 'Arsenal', 'Manchester United', 'Crawley Town'], ans: 2, cat: 'Daily Challenge', diff: 'easy', hint: 'They play at Old Trafford.' },

          { q: 'Who scored the winning goal for Germany in the 2014 World Cup Final?', opts: ['Thomas Muller', 'Miroslav Klose', 'Mario Gotze', 'Toni Kroos'], ans: 2, cat: 'Daily Challenge', diff: 'easy', hint: 'Volleyed in extra time.' }
        ],

        'man-utd': [
          { q: 'Who is Manchester United\'s all-time leading goalscorer?', opts: ['Bobby Charlton', 'Wayne Rooney', 'Ryan Giggs', 'Denis Law'], ans: 1, cat: 'Manchester United', diff: 'easy', hint: 'He scored 253 goals for the club.' },

          { q: 'In what year did Manchester United win their historic Treble?', opts: ['1998', '1999', '2001', '2008'], ans: 1, cat: 'Manchester United', diff: 'easy', hint: 'Beat Bayern Munich dramatically in Barcelona.' },

          { q: 'Who was the manager of Manchester United before Sir Alex Ferguson?', opts: ['Dave Sexton', 'Ron Atkinson', 'Tommy Docherty', 'Wilf McGuinness'], ans: 1, cat: 'Manchester United', diff: 'hard', hint: 'Managed from 1981 to 1986.' },

          { q: 'Which club did Cristiano Ronaldo join Manchester United from in 2003?', opts: ['Benfica', 'Porto', 'Sporting CP', 'Braga'], ans: 2, cat: 'Manchester United', diff: 'easy', hint: 'Portuguese club based in Lisbon.' },

          { q: 'What is the name of Manchester United\'s home stadium?', opts: ['Anfield', 'Old Trafford', 'Stamford Bridge', 'Emirates Stadium'], ans: 1, cat: 'Manchester United', diff: 'easy', hint: 'Known as the Theatre of Dreams.' },

          { q: 'Who holds the record for the most appearances for Manchester United?', opts: ['Bobby Charlton', 'Paul Scholes', 'Ryan Giggs', 'Gary Neville'], ans: 2, cat: 'Manchester United', diff: 'medium', hint: '963 appearances.' }
        ],

        'man-city': [
          { q: 'Who scored the famous 93:20 winning goal to win Man City the 2012 Premier League?', opts: ['Mario Balotelli', 'Edin Dzeko', 'Sergio Aguero', 'Yaya Toure'], ans: 2, cat: 'Manchester City', diff: 'easy', hint: 'Argentine legendary striker.' },

          { q: 'In what year did Pep Guardiola become the manager of Manchester City?', opts: ['2014', '2015', '2016', '2017'], ans: 2, cat: 'Manchester City', diff: 'medium', hint: 'Joined after managing Bayern Munich.' },

          { q: 'What was Manchester City\'s home stadium before moving to the Etihad Stadium?', opts: ['Hyde Road', 'Maine Road', 'Belle Vue', 'Boundary Park'], ans: 1, cat: 'Manchester City', diff: 'medium', hint: 'They played there from 1923 to 2003.' },

          { q: 'Which player won the Premier League Player of the Season award for City in their treble-winning 2022-23 season?', opts: ['Kevin De Bruyne', 'Erling Haaland', 'Rodri', 'Ilkay Gundogan'], ans: 1, cat: 'Manchester City', diff: 'easy', hint: 'Scored 36 Premier League goals.' },

          { q: 'Who was the captain of Manchester City during their 2023 Champions League final win?', opts: ['Kevin De Bruyne', 'Kyle Walker', 'Ruben Dias', 'Ilkay Gundogan'], ans: 3, cat: 'Manchester City', diff: 'medium', hint: 'German midfielder who later joined Barcelona.' },

          { q: 'Who did Manchester City beat to win their first ever European Cup/Champions League?', opts: ['Real Madrid', 'Inter Milan', 'Bayern Munich', 'AC Milan'], ans: 1, cat: 'Manchester City', diff: 'easy', hint: '1-0 victory in Istanbul, Rodri scored.' }
        ],

        'chelsea': [
          { q: 'Who is Chelsea\'s all-time leading goalscorer?', opts: ['Didier Drogba', 'Bobby Tambling', 'Frank Lampard', 'Eden Hazard'], ans: 2, cat: 'Chelsea FC', diff: 'easy', hint: 'Midfielder who scored 211 goals.' },

          { q: 'Which manager won Chelsea their first Premier League title in 2004-05?', opts: ['Claudio Ranieri', 'Carlo Ancelotti', 'Jose Mourinho', 'Guus Hiddink'], ans: 2, cat: 'Chelsea FC', diff: 'easy', hint: 'The Special One.' },

          { q: 'Who did Chelsea defeat in the 2021 Champions League final?', opts: ['Real Madrid', 'Bayern Munich', 'Manchester City', 'Atletico Madrid'], ans: 2, cat: 'Chelsea FC', diff: 'easy', hint: 'Kai Havertz scored the only goal.' },

          { q: 'What is Chelsea\'s home stadium?', opts: ['Craven Cottage', 'Stamford Bridge', 'Selhurst Park', 'The Den'], ans: 1, cat: 'Chelsea FC', diff: 'easy', hint: 'Located in Fulham, London.' },

          { q: 'Who scored the winning penalty for Chelsea in the 2012 Champions League shootout against Bayern Munich?', opts: ['Frank Lampard', 'Ashley Cole', 'Didier Drogba', 'David Luiz'], ans: 2, cat: 'Chelsea FC', diff: 'medium', hint: 'Ivorian legendary striker.' },

          { q: 'In what year was Chelsea FC founded?', opts: ['1888', '1905', '1910', '1920'], ans: 1, cat: 'Chelsea FC', diff: 'hard', hint: 'Founded in The Rising Sun pub.' }
        ],

        'arsenal': [
          { q: 'What nickname is given to Arsenal\'s unbeaten 2003-04 Premier League team?', opts: ['The Unbeatables', 'The Invincibles', 'The Gunners', 'The Centurions'], ans: 1, cat: 'Arsenal FC', diff: 'easy', hint: '26 wins, 12 draws, 0 losses.' },

          { q: 'Who is Arsenal\'s all-time leading goalscorer?', opts: ['Ian Wright', 'Thierry Henry', 'Cliff Bastin', 'Dennis Bergkamp'], ans: 1, cat: 'Arsenal FC', diff: 'easy', hint: 'French striker, scored 228 goals.' },

          { q: 'Who was the manager of Arsenal during their 2003-04 unbeaten season?', opts: ['George Graham', 'Bruce Rioch', 'Arsene Wenger', 'Mikel Arteta'], ans: 2, cat: 'Arsenal FC', diff: 'easy', hint: 'Longest-serving manager in Arsenal history.' },

          { q: 'Before moving to the Emirates Stadium in 2006, where did Arsenal play their home matches?', opts: ['White Hart Lane', 'Highbury', 'Plumstead', 'The Valley'], ans: 1, cat: 'Arsenal FC', diff: 'easy', hint: 'Played there from 1913 to 2006.' },

          { q: 'Which player holds the record for most appearances for Arsenal?', opts: ['Tony Adams', 'David O\'Leary', 'Patrick Vieira', 'Thierry Henry'], ans: 1, cat: 'Arsenal FC', diff: 'hard', hint: '722 appearances.' },

          { q: 'Which club did Arsenal sign playmaker Martin Odegaard from?', opts: ['Real Sociedad', 'Real Madrid', 'Heerenveen', 'Vitesse'], ans: 1, cat: 'Arsenal FC', diff: 'easy', hint: 'Spanish giants.' }
        ],

        'liverpool': [
          { q: 'How many Champions League/European Cup titles have Liverpool won?', opts: ['4', '5', '6', '7'], ans: 2, cat: 'Liverpool FC', diff: 'easy', hint: 'Most of any English club.' },

          { q: 'Who is Liverpool\'s all-time top goalscorer?', opts: ['Steven Gerrard', 'Robbie Fowler', 'Ian Rush', 'Kenny Dalglish'], ans: 2, cat: 'Liverpool FC', diff: 'medium', hint: 'Welsh striker who scored 346 goals.' },

          { q: 'What is the famous anthem sung by Liverpool fans before matches?', opts: ['Blue Moon', 'Glory Glory', 'You\'ll Never Walk Alone', 'Forever Blowing Bubbles'], ans: 2, cat: 'Liverpool FC', diff: 'easy', hint: 'By Gerry and the Pacemakers.' },

          { q: 'Which team did Liverpool famously defeat in the 2005 Champions League final after trailing 3-0?', opts: ['Real Madrid', 'Juventus', 'AC Milan', 'Bayern Munich'], ans: 2, cat: 'Liverpool FC', diff: 'easy', hint: 'The Miracle of Istanbul.' },

          { q: 'Who managed Liverpool to their first Premier League title in 30 years in 2019-20?', opts: ['Brendan Rodgers', 'Rafael Benitez', 'Jurgen Klopp', 'Kenny Dalglish'], ans: 2, cat: 'Liverpool FC', diff: 'easy', hint: 'German manager who left in 2024.' },

          { q: 'What is the name of Liverpool\'s home stadium?', opts: ['Goodison Park', 'Anfield', 'Old Trafford', 'St James\' Park'], ans: 1, cat: 'Liverpool FC', diff: 'easy', hint: 'Features the famous Spion Kop stand.' }
        ],

        'real-madrid': [
          { q: 'Who is Real Madrid\'s all-time leading goalscorer?', opts: ['Raul', 'Karim Benzema', 'Alfredo Di Stefano', 'Cristiano Ronaldo'], ans: 3, cat: 'Real Madrid', diff: 'easy', hint: 'Scored 450 goals in 438 games.' },

          { q: 'How many Champions League/European Cup trophies has Real Madrid won?', opts: ['10', '12', '14', '15'], ans: 3, cat: 'Real Madrid', diff: 'easy', hint: 'Most successful club in European football history.' },

          { q: 'Which team does Real Madrid contest \'El Clasico\' against?', opts: ['Atletico Madrid', 'FC Barcelona', 'Valencia', 'Sevilla'], ans: 1, cat: 'Real Madrid', diff: 'easy', hint: 'Greatest rivalry in Spanish football.' },

          { q: 'Who is the only manager to win the Champions League 5 times, including with Real Madrid?', opts: ['Pep Guardiola', 'Carlo Ancelotti', 'Zinedine Zidane', 'Jose Mourinho'], ans: 1, cat: 'Real Madrid', diff: 'medium', hint: 'Italian manager known as Don Carlo.' },

          { q: 'What is the nickname given to Real Madrid\'s team because of their white shirts?', opts: ['Los Colchoneros', 'Los Blancos', 'Los Culers', 'Los Merengues'], ans: 1, cat: 'Real Madrid', diff: 'easy', hint: 'The Whites.' },

          { q: 'In which stadium does Real Madrid play their home matches?', opts: ['Wanda Metropolitano', 'Santiago Bernabeu', 'San Siro', 'Mestalla'], ans: 1, cat: 'Real Madrid', diff: 'easy', hint: 'Famous stadium in Madrid.' }
        ],

        'barcelona': [
          { q: 'Who is FC Barcelona\'s all-time leading goalscorer?', opts: ['Luis Suarez', 'Cesar Rodriguez', 'Lionel Messi', 'Ronaldinho'], ans: 2, cat: 'FC Barcelona', diff: 'easy', hint: '672 official goals.' },

          { q: 'What is the name of Barcelona\'s famous youth academy?', opts: ['La Masia', 'Cantera', 'Castilla', 'Cobham'], ans: 0, cat: 'FC Barcelona', diff: 'easy', hint: 'The Farmhouse.' },

          { q: 'Who managed Barcelona to a historic sextuple in 2009?', opts: ['Luis Enrique', 'Frank Rijkaard', 'Pep Guardiola', 'Johan Cruyff'], ans: 2, cat: 'FC Barcelona', diff: 'medium', hint: 'Now manager of Manchester City.' },

          { q: 'What is the motto of FC Barcelona?', opts: ['Hala Madrid', 'Mes que un club', 'Mia San Mia', 'Visca Barca'], ans: 1, cat: 'FC Barcelona', diff: 'easy', hint: 'More than a club.' },

          { q: 'Which player scored the winning goal in the 1992 European Cup Final to win Barca their first title?', opts: ['Hristo Stoichkov', 'Michael Laudrup', 'Ronald Koeman', 'Pep Guardiola'], ans: 2, cat: 'FC Barcelona', diff: 'hard', hint: 'Scored a free kick in extra time vs Sampdoria.' },

          { q: 'In which year did Barcelona win their last Champions League title?', opts: ['2009', '2011', '2015', '2018'], ans: 2, cat: 'FC Barcelona', diff: 'medium', hint: 'Part of their second treble under Luis Enrique.' }
        ],

        'atletico': [
          { q: 'Who is the long-serving manager of Atletico Madrid who took over in 2011?', opts: ['Diego Simeone', 'Mauricio Pochettino', 'Unai Emery', 'Marcelino'], ans: 0, cat: 'Atletico Madrid', diff: 'easy', hint: 'Argentine manager nicknamed El Cholo.' },

          { q: 'What is the nickname of Atletico Madrid?', opts: ['Los Colchoneros', 'Los Blancos', 'Los Culers', 'Los Leones'], ans: 0, cat: 'Atletico Madrid', diff: 'medium', hint: 'The Mattress Makers.' },

          { q: 'What is the name of Atletico Madrid\'s home stadium?', opts: ['Vicente Calderon', 'Santiago Bernabeu', 'Metropolitano', 'Mestalla'], ans: 2, cat: 'Atletico Madrid', diff: 'easy', hint: 'Formerly known as Wanda Metropolitano.' },

          { q: 'Which club did Atletico Madrid defeat in the 2018 Europa League final?', opts: ['Athletic Bilbao', 'Marseille', 'Arsenal', 'Fulham'], ans: 1, cat: 'Atletico Madrid', diff: 'hard', hint: 'French club, 3-0 victory.' },

          { q: 'Who scored the dramatic title-winning goal for Atletico Madrid on the final day of the 2020-21 La Liga season?', opts: ['Luis Suarez', 'Koke', 'Angel Correa', 'Marcos Llorente'], ans: 0, cat: 'Atletico Madrid', diff: 'medium', hint: 'Uruguayan striker who signed from Barcelona.' },

          { q: 'How many times have Atletico Madrid finished as Champions League/European Cup runners-up?', opts: ['1', '2', '3', '4'], ans: 2, cat: 'Atletico Madrid', diff: 'hard', hint: '1974, 2014, and 2016.' }
        ],

        'bundesliga': [
          { q: 'Which club has won the most Bundesliga titles?', opts: ['Borussia Dortmund', 'Bayern Munich', 'Hamburger SV', 'Werder Bremen'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'They won 11 consecutive titles from 2013 to 2023.' },

          { q: 'Who is the Bundesliga\'s all-time leading goalscorer?', opts: ['Robert Lewandowski', 'Gerd Muller', 'Jupp Heynckes', 'Klaus Fischer'], ans: 1, cat: 'Bundesliga', diff: 'medium', hint: 'Der Bomber, scored 365 goals.' },

          { q: 'Which team completed an unbeaten domestic double in the 2023-24 season?', opts: ['Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'VfB Stuttgart'], ans: 2, cat: 'Bundesliga', diff: 'easy', hint: 'Managed by Xabi Alonso.' },

          { q: 'What is the classic rivalry match between Bayern Munich and Borussia Dortmund called?', opts: ['Revierderby', 'Der Klassiker', 'Nordderby', 'Rheinderby'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'The German Classic.' },

          { q: 'Which player holds the record for the most goals scored in a single Bundesliga season?', opts: ['Gerd Muller', 'Robert Lewandowski', 'Harry Kane', 'Pierre-Emerick Aubameyang'], ans: 1, cat: 'Bundesliga', diff: 'medium', hint: '41 goals in the 2020-21 season.' },

          { q: 'Which club is nicknamed \'Die Fohlen\' (The Foals)?', opts: ['Borussia Monchengladbach', 'Eintracht Frankfurt', 'VfB Stuttgart', 'FC Koln'], ans: 0, cat: 'Bundesliga', diff: 'medium', hint: 'Traditional club based in North Rhine-Westphalia.' },

          { q: 'Which team plays their home matches at the Signal Iduna Park?', opts: ['Schalke 04', 'Borussia Dortmund', 'Werder Bremen', 'Hertha Berlin'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'Home of the Yellow Wall.' },

          { q: 'Who is the youngest player to score a goal in Bundesliga history?', opts: ['Nuri Sahin', 'Florian Wirtz', 'Youssoufa Moukoko', 'Jamal Musiala'], ans: 2, cat: 'Bundesliga', diff: 'hard', hint: 'Scored at age 16 years and 28 days for Dortmund in 2020.' },

          { q: 'Which manager won the Bundesliga with Wolfsburg in 2009?', opts: ['Felix Magath', 'Jupp Heynckes', 'Jurgen Klopp', 'Dieter Hecking'], ans: 0, cat: 'Bundesliga', diff: 'hard', hint: 'German manager famous for his tough fitness training.' },

          { q: 'Which Bundesliga club is owned entirely by the chemical company Bayer?', opts: ['Bayer Leverkusen', 'Bayer Uerdingen', 'FC Koln', 'Mainz 05'], ans: 0, cat: 'Bundesliga', diff: 'easy', hint: 'Nicknamed Werkself.' },

          { q: 'Who has made the most appearances in Bundesliga history?', opts: ['Karl-Heinz Korbel', 'Oliver Kahn', 'Manfred Kaltz', 'Lothar Matthaus'], ans: 0, cat: 'Bundesliga', diff: 'hard', hint: '602 matches, all for Eintracht Frankfurt.' },

          { q: 'Which club won the Bundesliga in the 2003-04 season?', opts: ['Bayern Munich', 'Werder Bremen', 'Stuttgart', 'Schalke 04'], ans: 1, cat: 'Bundesliga', diff: 'medium', hint: 'Led by Brazilian striker Ailton.' },

          { q: 'What is the name of the stadium where Bayern Munich plays?', opts: ['Allianz Arena', 'Olympiastadion', 'Signal Iduna Park', 'RheinEnergieStadion'], ans: 0, cat: 'Bundesliga', diff: 'easy', hint: 'Famous for its color-changing outer panels.' },

          { q: 'Which club is known as \'Die Roten Bullen\'?', opts: ['Mainz 05', 'RB Leipzig', 'Hoffenheim', 'Freiburg'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'Founded in 2009, backed by Red Bull.' },

          { q: 'Which player was nicknamed \'Der Bomber\'?', opts: ['Gerd Muller', 'Karl-Heinz Rummenigge', 'Miroslav Klose', 'Jupp Heynckes'], ans: 0, cat: 'Bundesliga', diff: 'medium', hint: 'Scored 365 Bundesliga goals.' },

          { q: 'Which team was promoted to the Bundesliga for the first time in their history in 2019?', opts: ['Paderborn', 'Union Berlin', 'Heidenheim', 'Darmstadt'], ans: 1, cat: 'Bundesliga', diff: 'medium', hint: 'Based in East Berlin, plays at An der Alten Försterei.' },

          { q: 'Who is the all-time leading foreign goalscorer in the Bundesliga?', opts: ['Claudio Pizarro', 'Robert Lewandowski', 'Giovane Elber', 'Pierre-Emerick Aubameyang'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'Polish striker who played for Dortmund and Bayern.' },

          { q: 'Which club won their first ever Bundesliga title in 2024?', opts: ['Bayer Leverkusen', 'Stuttgart', 'RB Leipzig', 'Eintracht Frankfurt'], ans: 0, cat: 'Bundesliga', diff: 'easy', hint: 'Went completely undefeated domestically.' },

          { q: 'What is the name of the derby between Schalke 04 and Borussia Dortmund?', opts: ['Klassiker', 'Revierderby', 'Nordderby', 'Rheinderby'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'Contested in the Ruhr region.' },

          { q: 'Which player scored 5 goals in 9 minutes after coming on as a sub in 2015?', opts: ['Robert Lewandowski', 'Pierre-Emerick Aubameyang', 'Thomas Muller', 'Arjen Robben'], ans: 0, cat: 'Bundesliga', diff: 'easy', hint: 'Achieved against Wolfsburg.' },

          { q: 'Which club is known as \'The Billy Goats\'?', opts: ['FC Koln', 'Hamburger SV', 'Werder Bremen', 'Mainz 05'], ans: 0, cat: 'Bundesliga', diff: 'medium', hint: 'Keep a real goat mascot named Hennes.' },

          { q: 'Who is the youngest manager in Bundesliga history?', opts: ['Julian Nagelsmann', 'Domenico Tedesco', 'Thomas Tuchel', 'Hansi Flick'], ans: 0, cat: 'Bundesliga', diff: 'medium', hint: 'Appointed Hoffenheim boss at age 28 in 2016.' },

          { q: 'Which team plays at the MHPArena?', opts: ['Karlsruher SC', 'VfB Stuttgart', 'Freiburg', 'Augsburg'], ans: 1, cat: 'Bundesliga', diff: 'medium', hint: 'They won the Bundesliga in 2007.' },

          { q: 'Which German club\'s motto is \'Mia San Mia\'?', opts: ['Borussia Dortmund', 'Bayern Munich', 'Schalke 04', 'Werder Bremen'], ans: 1, cat: 'Bundesliga', diff: 'easy', hint: 'Translates to \'We Are Who We Are\'.' },

          { q: 'Which club did Thomas Müller spend his entire professional career with?', opts: ['Stuttgart', '1860 Munich', 'Bayern Munich', 'Nurnberg'], ans: 2, cat: 'Bundesliga', diff: 'easy', hint: 'Legendary space investigator.' }
        ],

        'serie-a': [
          { q: 'Which club has won the most Serie A titles?', opts: ['AC Milan', 'Inter Milan', 'Juventus', 'Roma'], ans: 2, cat: 'Serie A', diff: 'easy', hint: 'Also known as the Old Lady, with over 36 titles.' },

          { q: 'Who is Serie A\'s all-time leading goalscorer?', opts: ['Francesco Totti', 'Silvio Piola', 'Gunnar Nordahl', 'Giuseppe Meazza'], ans: 1, cat: 'Serie A', diff: 'hard', hint: 'Scored 274 goals between 1929 and 1954.' },

          { q: 'What name is given to the Milan derby between AC Milan and Inter Milan?', opts: ['Derby d\'Italia', 'Derby della Capitale', 'Derby della Madonnina', 'Derby della Lanterna'], ans: 2, cat: 'Serie A', diff: 'medium', hint: 'Named after the statue of the Virgin Mary on Milan Cathedral.' },

          { q: 'Which team won their first Serie A title in 33 years in the 2022-23 season?', opts: ['Lazio', 'Napoli', 'Fiorentina', 'Roma'], ans: 1, cat: 'Serie A', diff: 'easy', hint: 'Sparked massive celebrations in Naples.' },

          { q: 'Which player holds the record for most Serie A appearances?', opts: ['Paolo Maldini', 'Francesco Totti', 'Gianluigi Buffon', 'Javier Zanetti'], ans: 2, cat: 'Serie A', diff: 'medium', hint: '657 matches, mostly with Juventus.' },

          { q: 'Which club is nicknamed \'I Nerazzurri\'?', opts: ['AC Milan', 'Inter Milan', 'Atalanta', 'Lazio'], ans: 1, cat: 'Serie A', diff: 'easy', hint: 'Translates to the Black and Blues.' },

          { q: 'Which club is nicknamed \'I Rossoneri\'?', opts: ['AC Milan', 'Inter Milan', 'Bologna', 'Roma'], ans: 0, cat: 'Serie A', diff: 'easy', hint: 'Translates to the Red and Blacks.' },

          { q: 'Which stadium is shared by AC Milan and Inter Milan?', opts: ['San Siro', 'Stadio Olimpico', 'Allianz Stadium', 'Stadio Diego Armando Maradona'], ans: 0, cat: 'Serie A', diff: 'easy', hint: 'Also known as Stadio Giuseppe Meazza.' },

          { q: 'Who is Juventus\'s all-time leading goalscorer?', opts: ['Alessandro Del Piero', 'Roberto Baggio', 'Michel Platini', 'David Trezeguet'], ans: 0, cat: 'Serie A', diff: 'easy', hint: 'Scored 290 goals for the club.' },

          { q: 'Which club won the Serie A title in the 1999-2000 season?', opts: ['Roma', 'AC Milan', 'Lazio', 'Juventus'], ans: 2, cat: 'Serie A', diff: 'hard', hint: 'Based in Rome, featuring Nedved, Veron, and Nesta.' },

          { q: 'What is the derby between Juventus and Inter Milan called?', opts: ['Derby della Madonnina', 'Derby d\'Italia', 'Derby del Sole', 'Derby della Capitale'], ans: 1, cat: 'Serie A', diff: 'medium', hint: 'The Derby of Italy.' },

          { q: 'Which team is nicknamed \'La Viola\' (The Violet)?', opts: ['Palermo', 'Fiorentina', 'Bologna', 'Sampdoria'], ans: 1, cat: 'Serie A', diff: 'easy', hint: 'Play in Florence, wearing purple.' },

          { q: 'Who was the manager of AC Milan during their dominant early 1990s era?', opts: ['Arrigo Sacchi', 'Fabio Capello', 'Carlo Ancelotti', 'Marcello Lippi'], ans: 1, cat: 'Serie A', diff: 'hard', hint: 'Led them to a 58-match unbeaten streak.' },

          { q: 'Which team plays their home matches at the Stadio Olimpico?', opts: ['Napoli', 'Roma & Lazio', 'Fiorentina', 'Sampdoria & Genoa'], ans: 1, cat: 'Serie A', diff: 'easy', hint: 'Shared stadium in the capital city.' },

          { q: 'Which legendary player spent his entire 25-year career at Roma?', opts: ['Daniele De Rossi', 'Francesco Totti', 'Alessandro Florenzi', 'Giuseppe Giannini'], ans: 1, cat: 'Serie A', diff: 'easy', hint: 'Known as \'Il Capitano\'.' },

          { q: 'Which team won the Serie A title in the 2023-24 season?', opts: ['Juventus', 'AC Milan', 'Inter Milan', 'Napoli'], ans: 2, cat: 'Serie A', diff: 'easy', hint: 'They earned their second star on their shirt.' },

          { q: 'Which club is known as \'La Vecchia Signora\' (The Old Lady)?', opts: ['Juventus', 'AC Milan', 'Inter Milan', 'Genoa'], ans: 0, cat: 'Serie A', diff: 'easy', hint: 'The most successful club in Italy.' },

          { q: 'Who is the only goalkeeper to win the Serie A Footballer of the Year award?', opts: ['Gianluigi Buffon', 'Francesco Toldo', 'Julio Cesar', 'Samir Handanovic'], ans: 0, cat: 'Serie A', diff: 'medium', hint: 'Won it in 2017 with Juventus.' },

          { q: 'Which club did Diego Maradona play for in Serie A?', opts: ['Napoli', 'Barcelona', 'Sevilla', 'Boca Juniors'], ans: 0, cat: 'Serie A', diff: 'easy', hint: 'Led them to their first two Scudetti.' },

          { q: 'Which city does the club Torino FC come from?', opts: ['Milan', 'Turin', 'Rome', 'Genoa'], ans: 1, cat: 'Serie A', diff: 'easy', hint: 'Share a city with Juventus.' },

          { q: 'What is the derby between Roma and Lazio called?', opts: ['Derby della Capitale', 'Derby del Sole', 'Derby della Lanterna', 'Derby dell\'Appennino'], ans: 0, cat: 'Serie A', diff: 'easy', hint: 'Derby of the Capital.' },

          { q: 'Which manager won the Serie A title with Juventus, AC Milan, and Inter Milan?', opts: ['Giovanni Trapattoni', 'Antonio Conte', 'Massimiliano Allegri', 'Marcello Lippi'], ans: 0, cat: 'Serie A', diff: 'hard', hint: 'Legendary Italian coach, also managed Bayern Munich.' },

          { q: 'Which club won the Scudetto in 1970, their only league title to date?', opts: ['Cagliari', 'Verona', 'Bologna', 'Sampdoria'], ans: 0, cat: 'Serie A', diff: 'hard', hint: 'Based in Sardinia, led by Gigi Riva.' },

          { q: 'Who holds the record for the most goals in a single Serie A season?', opts: ['Gonzalo Higuain & Ciro Immobile', 'Cristiano Ronaldo', 'Luca Toni', 'Zlatan Ibrahimovic'], ans: 0, cat: 'Serie A', diff: 'medium', hint: 'Both scored 36 goals (Higuain in 2016, Immobile in 2020).' },

          { q: 'Which player was known as \'Il Divin Codino\' (The Divine Ponytail)?', opts: ['Roberto Baggio', 'Andrea Pirlo', 'Gianfranco Zola', 'Alessandro Del Piero'], ans: 0, cat: 'Serie A', diff: 'medium', hint: 'Famous for his penalty miss in the 1994 World Cup final.' }
        ],

        'ligue-1': [
          { q: 'Which club has won the most Ligue 1 titles?', opts: ['Saint-Etienne', 'Marseille', 'Monaco', 'Paris Saint-Germain'], ans: 3, cat: 'Ligue 1', diff: 'easy', hint: 'Recently surpassed Saint-Etienne\'s record of 10 titles.' },

          { q: 'Who is Ligue 1\'s all-time leading goalscorer?', opts: ['Kylian Mbappe', 'Jean-Pierre Papin', 'Delio Onnis', 'Zlatan Ibrahimovic'], ans: 2, cat: 'Ligue 1', diff: 'hard', hint: 'Argentine striker, scored 299 goals from 1971 to 1986.' },

          { q: 'What is the name of the rivalry match between Paris Saint-Germain and Marseille?', opts: ['Derby du Nord', 'Le Classique', 'Choc des Olympiques', 'Derby de la Cote d\'Azur'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'The French Classic.' },

          { q: 'Which club did Eden Hazard play for when he won the Ligue 1 title in 2011?', opts: ['Lyon', 'Marseille', 'Lille', 'Monaco'], ans: 2, cat: 'Ligue 1', diff: 'medium', hint: 'North French club, defeated PSG to the title.' },

          { q: 'Which team won Ligue 1 in 2016-17 with stars like Mbappe, Falcao, and Bernardo Silva?', opts: ['Lyon', 'Monaco', 'Lille', 'Nice'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'Based in the principality of Monaco.' },

          { q: 'Which club is nicknamed \'Les Gones\'?', opts: ['Marseille', 'Lyon', 'Lille', 'Saint-Etienne'], ans: 1, cat: 'Ligue 1', diff: 'medium', hint: 'Based in France\'s third-largest city.' },

          { q: 'What is Paris Saint-Germain\'s home stadium?', opts: ['Stade de France', 'Parc des Princes', 'Stade Velodrome', 'Stade Louis II'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'Located in Paris.' },

          { q: 'Who is Paris Saint-Germain\'s all-time leading goalscorer?', opts: ['Edinson Cavani', 'Zlatan Ibrahimovic', 'Kylian Mbappe', 'Neymar'], ans: 2, cat: 'Ligue 1', diff: 'easy', hint: 'Scored 256 goals before leaving in 2024.' },

          { q: 'Which club won seven consecutive Ligue 1 titles from 2002 to 2008?', opts: ['Paris Saint-Germain', 'Lyon', 'Marseille', 'Monaco'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'Dominated French football in the 2000s.' },

          { q: 'Which Ligue 1 team plays their home games at the Stade Vélodrome?', opts: ['Marseille', 'Nice', 'Monaco', 'Montpellier'], ans: 0, cat: 'Ligue 1', diff: 'easy', hint: 'Port city in the south of France.' },

          { q: 'Which French club is the only one to have won the UEFA Champions League?', opts: ['Paris Saint-Germain', 'Lyon', 'Marseille', 'Monaco'], ans: 2, cat: 'Ligue 1', diff: 'medium', hint: 'Won it in 1993.' },

          { q: 'What is the nickname of the French national league trophy?', opts: ['L\'Hexagone', 'Hexagoal', 'Ligue Cup', 'Le Bouclier'], ans: 1, cat: 'Ligue 1', diff: 'hard', hint: 'Refers to the shape of France.' },

          { q: 'Which club won the Ligue 1 title in the 2020-21 season?', opts: ['Paris Saint-Germain', 'Lille', 'Monaco', 'Lyon'], ans: 1, cat: 'Ligue 1', diff: 'medium', hint: 'Nicknamed Les Dogues.' },

          { q: 'Who is the manager of Paris Saint-Germain as of 2024?', opts: ['Thomas Tuchel', 'Mauricio Pochettino', 'Luis Enrique', 'Christophe Galtier'], ans: 2, cat: 'Ligue 1', diff: 'easy', hint: 'Former Barcelona and Spain manager.' },

          { q: 'Which team plays their home matches at the Stade Louis II?', opts: ['Monaco', 'Nice', 'Marseille', 'Cannes'], ans: 0, cat: 'Ligue 1', diff: 'easy', hint: 'Principality club.' },

          { q: 'Which city is home to the club LOSC?', opts: ['Lyon', 'Lille', 'Lens', 'Lorient'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'Close to the Belgian border.' },

          { q: 'Who is the youngest player to debut for Monaco, breaking Thierry Henry\'s record?', opts: ['Kylian Mbappe', 'Anthony Martial', 'Bernardo Silva', 'Yannick Carrasco'], ans: 0, cat: 'Ligue 1', diff: 'medium', hint: 'Made his debut in 2015 at age 16.' },

          { q: 'Which club is known as \'Les Verts\' (The Greens)?', opts: ['Saint-Etienne', 'Nantes', 'Rennes', 'Metz'], ans: 0, cat: 'Ligue 1', diff: 'easy', hint: 'Wore green shirts, dominated in the 1970s.' },

          { q: 'Which club did Zlatan Ibrahimovic play for in France?', opts: ['Paris Saint-Germain', 'Marseille', 'Monaco', 'Lyon'], ans: 0, cat: 'Ligue 1', diff: 'easy', hint: 'Said \'I came like a king, left like a legend\'.' },

          { q: 'Which city does the derby \'Derby du Rhône\' take place in?', opts: ['Lyon & Saint-Etienne', 'Marseille & Nice', 'Lille & Lens', 'Paris & Marseille'], ans: 0, cat: 'Ligue 1', diff: 'medium', hint: 'Rivalry between Saint-Etienne and Lyon.' },

          { q: 'Who won the Ligue 1 Player of the Year award in the 2023-24 season?', opts: ['Ousmane Dembele', 'Kylian Mbappe', 'Pierre-Emerick Aubameyang', 'Alexandre Lacazette'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'Won his 5th consecutive award.' },

          { q: 'Which club did Eden Hazard play for when he won the Ligue 1 title?', opts: ['Lille', 'Lyon', 'Marseille', 'Monaco'], ans: 0, cat: 'Ligue 1', diff: 'easy', hint: 'Won the double in 2011.' },

          { q: 'Which Ligue 1 club has the motto \'Droit au but\' (Straight to the goal)?', opts: ['Marseille', 'PSG', 'Lyon', 'Nantes'], ans: 0, cat: 'Ligue 1', diff: 'medium', hint: 'Featured on their club crest.' },

          { q: 'Which team won Ligue 1 in 2011-12 in a historic surprise?', opts: ['Montpellier', 'Lille', 'Auxerre', 'Bordeaux'], ans: 0, cat: 'Ligue 1', diff: 'medium', hint: 'Led by Olivier Giroud\'s goals.' },

          { q: 'Which club did Karim Benzema play for before joining Real Madrid?', opts: ['Marseille', 'Lyon', 'Saint-Etienne', 'Bordeaux'], ans: 1, cat: 'Ligue 1', diff: 'easy', hint: 'Won four Ligue 1 titles with them.' }
        ]
      };

      for (const key of ['man-utd', 'man-city', 'chelsea', 'arsenal', 'liverpool', 'real-madrid', 'barcelona', 'atletico']) {
        if (!QUESTIONS[key]) QUESTIONS[key] = QUESTIONS['premier-league'].slice(0, 5);
      }

      const LEADERBOARD_DATA = [
        { name: 'FutbolKing99', score: 9820, correct: 142, streak: 15, country: '🇧🇷', level: 42 },

        { name: 'TacticsGuru', score: 8750, correct: 128, streak: 11, country: '🇬🇧', level: 38 },

        { name: 'MessiFan10', score: 7920, correct: 115, streak: 8, country: '🇦🇷', level: 34 },

        { name: 'BallerIQ', score: 7340, correct: 109, streak: 7, country: '🇩🇪', level: 31 },

        { name: 'GoalMachine', score: 6800, correct: 98, streak: 6, country: '🇫🇷', level: 28 },

        { name: 'CRSevenFan', score: 6210, correct: 89, streak: 5, country: '🇵🇹', level: 25 },

        { name: 'TifoVerde', score: 5670, correct: 81, streak: 4, country: '🇮🇹', level: 22 },

        { name: 'ElClasico', score: 5100, correct: 74, streak: 3, country: '🇪🇸', level: 20 },

      ];


      const CATEGORIES_DATA = [

        { id: 'premier-league', icon: 'PL', logo: 'https://crests.football-data.org/PL.png', name: 'Premier League', count: '31 questions', color: '#3d0099' },

        { id: 'la-liga', icon: 'LL', logo: 'https://crests.football-data.org/PD.png', name: 'La Liga', count: '28 questions', color: '#ee8707' },

        { id: 'ucl', icon: 'UCL', logo: 'https://crests.football-data.org/CL.png', name: 'Champions League', count: '25 questions', color: '#1a1aff' },

        { id: 'world-cup', icon: 'WC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/960px-2026_FIFA_World_Cup_emblem.svg.png', name: 'World Cup', count: '25 questions', color: '#006633' },

        { id: 'bundesliga', icon: 'BL', logo: 'https://crests.football-data.org/BL1.png', name: 'Bundesliga', count: '25 questions', color: '#d4021d' },

        { id: 'serie-a', icon: 'SA', logo: 'https://crests.football-data.org/SA.png', name: 'Serie A', count: '25 questions', color: '#0033A0' },

        { id: 'ligue-1', icon: 'L1', logo: 'https://crests.football-data.org/FL1.png', name: 'Ligue 1', count: '25 questions', color: '#003f6e' },

        { id: 'daily', icon: 'DC', logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path><path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z"></path></svg>', name: 'Daily Challenge', count: '25 questions', color: '#d4a017' },

        { id: 'all-categories', icon: '🗂️', logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>', name: 'All Categories', count: 'Browse more', color: '#6b7280' },

        { id: 'transfer', icon: '🔄', logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>', name: 'Transfer Guesser', count: 'Wordle-style game', color: '#d97706' },

      ];


      const TRANSFER_PLAYERS = [
        { name: 'Erling Haaland', nationality: 'Norwegian', age: 24, position: 'Striker', league: 'Premier League', club: 'Man City', value: '180M', clubs: ['Bryne', 'Molde', 'RB Salzburg', 'Dortmund', 'Man City'] },
        { name: 'Kylian Mbappe', nationality: 'French', age: 26, position: 'Forward', league: 'La Liga', club: 'Real Madrid', value: '200M', clubs: ['Monaco', 'PSG', 'Real Madrid'] },
        { name: 'Jude Bellingham', nationality: 'English', age: 21, position: 'Midfielder', league: 'La Liga', club: 'Real Madrid', value: '180M', clubs: ['Birmingham City', 'Dortmund', 'Real Madrid'] },
        { name: 'Vinicius Jr', nationality: 'Brazilian', age: 24, position: 'Forward', league: 'La Liga', club: 'Real Madrid', value: '200M', clubs: ['Flamengo', 'Real Madrid'] },
        { name: 'Bukayo Saka', nationality: 'English', age: 23, position: 'Winger', league: 'Premier League', club: 'Arsenal', value: '150M', clubs: ['Arsenal'] },
        { name: 'Pedri', nationality: 'Spanish', age: 22, position: 'Midfielder', league: 'La Liga', club: 'Barcelona', value: '100M', clubs: ['Las Palmas', 'Barcelona'] },
        { name: 'Rodri', nationality: 'Spanish', age: 27, position: 'Midfielder', league: 'Premier League', club: 'Man City', value: '120M', clubs: ['Villarreal', 'Atletico Madrid', 'Man City'] },
        { name: 'Harry Kane', nationality: 'English', age: 30, position: 'Striker', league: 'Bundesliga', club: 'Bayern Munich', value: '100M', clubs: ['Leyton Orient', 'Millwall', 'Leicester', 'Norwich', 'Tottenham', 'Bayern Munich'] },
        { name: 'Cole Palmer', nationality: 'English', age: 22, position: 'Midfielder', league: 'Premier League', club: 'Chelsea', value: '90M', clubs: ['Man City', 'Chelsea'] },
        { name: 'Mohamed Salah', nationality: 'Egyptian', age: 32, position: 'Winger', league: 'Premier League', club: 'Liverpool', value: '55M', clubs: ['El Mokawloon', 'Basel', 'Chelsea', 'Fiorentina', 'Roma', 'Liverpool'] },
        { name: 'Kevin De Bruyne', nationality: 'Belgian', age: 34, position: 'Midfielder', league: 'Serie A', club: 'Napoli', value: '15M', clubs: ['Genk', 'Chelsea', 'Werder Bremen', 'Wolfsburg', 'Man City', 'Napoli'] },
        { name: 'Robert Lewandowski', nationality: 'Polish', age: 35, position: 'Striker', league: 'La Liga', club: 'Barcelona', value: '15M', clubs: ['Lech Poznan', 'Dortmund', 'Bayern Munich', 'Barcelona'] },
        { name: 'Antoine Griezmann', nationality: 'French', age: 33, position: 'Forward', league: 'La Liga', club: 'Atletico Madrid', value: '25M', clubs: ['Real Sociedad', 'Barcelona', 'Atletico Madrid'] },
        { name: 'Bruno Fernandes', nationality: 'Portuguese', age: 29, position: 'Midfielder', league: 'Premier League', club: 'Man United', value: '70M', clubs: ['Novara', 'Udinese', 'Sampdoria', 'Sporting CP', 'Man United'] },
        { name: 'Martin Odegaard', nationality: 'Norwegian', age: 25, position: 'Midfielder', league: 'Premier League', club: 'Arsenal', value: '110M', clubs: ['Stromsgodset', 'Real Madrid', 'Heerenveen', 'Vitesse', 'Real Sociedad', 'Arsenal'] },
        { name: 'Florian Wirtz', nationality: 'German', age: 23, position: 'Midfielder', league: 'Premier League', club: 'Liverpool', value: '130M', clubs: ['FC Koln', 'Bayer Leverkusen', 'Liverpool'] },
        { name: 'Jamal Musiala', nationality: 'German', age: 21, position: 'Midfielder', league: 'Bundesliga', club: 'Bayern Munich', value: '130M', clubs: ['Southampton', 'Chelsea', 'Bayern Munich'] },
        { name: 'Declan Rice', nationality: 'English', age: 25, position: 'Midfielder', league: 'Premier League', club: 'Arsenal', value: '120M', clubs: ['Chelsea', 'West Ham', 'Arsenal'] },
        { name: 'Lautaro Martinez', nationality: 'Argentine', age: 26, position: 'Striker', league: 'Serie A', club: 'Inter Milan', value: '110M', clubs: ['Racing Club', 'Inter Milan'] },
        { name: 'Victor Osimhen', nationality: 'Nigerian', age: 25, position: 'Striker', league: 'Serie A', club: 'Napoli', value: '100M', clubs: ['Wolfsburg', 'Charleroi', 'Lille', 'Napoli', 'Galatasaray'] },
        { name: 'Rafael Leao', nationality: 'Portuguese', age: 25, position: 'Winger', league: 'Serie A', club: 'AC Milan', value: '90M', clubs: ['Sporting CP', 'Lille', 'AC Milan'] },
        { name: 'Khvicha Kvaratskhelia', nationality: 'Georgian', age: 24, position: 'Winger', league: 'Ligue 1', club: 'Paris Saint-Germain', value: '80M', clubs: ['Dinamo Tbilisi', 'Rustavi', 'Lokomotiv Moscow', 'Rubin Kazan', 'Dinamo Batumi', 'Napoli', 'Paris Saint-Germain'] },
        { name: 'Phil Foden', nationality: 'English', age: 24, position: 'Midfielder', league: 'Premier League', club: 'Man City', value: '150M', clubs: ['Man City'] },
        { name: 'Gabriel Magalhaes', nationality: 'Brazilian', age: 26, position: 'Defender', league: 'Premier League', club: 'Arsenal', value: '70M', clubs: ['Avai', 'Lille', 'Troyes', 'Dinamo Zagreb', 'Arsenal'] },
        { name: 'Gabriel Martinelli', nationality: 'Brazilian', age: 22, position: 'Forward', league: 'Premier League', club: 'Arsenal', value: '70M', clubs: ['Ituano', 'Arsenal'] },
        { name: 'Gabriel Jesus', nationality: 'Brazilian', age: 27, position: 'Striker', league: 'Premier League', club: 'Arsenal', value: '65M', clubs: ['Palmeiras', 'Man City', 'Arsenal'] },
        { name: 'Bruno Guimaraes', nationality: 'Brazilian', age: 26, position: 'Midfielder', league: 'Premier League', club: 'Newcastle', value: '85M', clubs: ['Athletico Paranaense', 'Lyon', 'Newcastle'] },
        { name: 'Marcus Rashford', nationality: 'English', age: 28, position: 'Forward', league: 'La Liga', club: 'Barcelona', value: '50M', clubs: ['Man United', 'Aston Villa', 'Barcelona'] },
        { name: 'Marcus Thuram', nationality: 'French', age: 26, position: 'Forward', league: 'Serie A', club: 'Inter Milan', value: '65M', clubs: ['Sochaux', 'Guingamp', 'Gladbach', 'Inter Milan'] },
        { name: 'William Saliba', nationality: 'French', age: 23, position: 'Defender', league: 'Premier League', club: 'Arsenal', value: '80M', clubs: ['Saint-Etienne', 'Nice', 'Marseille', 'Arsenal'] },
        { name: 'Luis Diaz', nationality: 'Colombian', age: 27, position: 'Winger', league: 'Premier League', club: 'Liverpool', value: '75M', clubs: ['Junior', 'Porto', 'Liverpool'] },
        { name: 'Darwin Nunez', nationality: 'Uruguayan', age: 24, position: 'Striker', league: 'Premier League', club: 'Liverpool', value: '70M', clubs: ['Penarol', 'Almeria', 'Benfica', 'Liverpool'] },
        { name: 'Alexis Mac Allister', nationality: 'Argentine', age: 25, position: 'Midfielder', league: 'Premier League', club: 'Liverpool', value: '75M', clubs: ['Argentinos Juniors', 'Boca Juniors', 'Brighton', 'Liverpool'] },
        { name: 'Dominik Szoboszlai', nationality: 'Hungarian', age: 23, position: 'Midfielder', league: 'Premier League', club: 'Liverpool', value: '75M', clubs: ['Liefering', 'Salzburg', 'Leipzig', 'Liverpool'] },
        { name: 'Virgil van Dijk', nationality: 'Dutch', age: 32, position: 'Defender', league: 'Premier League', club: 'Liverpool', value: '32M', clubs: ['Groningen', 'Celtic', 'Southampton', 'Liverpool'] },
        { name: 'Trent Alexander-Arnold', nationality: 'English', age: 27, position: 'Defender', league: 'La Liga', club: 'Real Madrid', value: '75M', clubs: ['Liverpool', 'Real Madrid'] },
        { name: 'Alisson Becker', nationality: 'Brazilian', age: 31, position: 'Goalkeeper', league: 'Premier League', club: 'Liverpool', value: '28M', clubs: ['Internacional', 'Roma', 'Liverpool'] },
        { name: 'Ederson', nationality: 'Brazilian', age: 30, position: 'Goalkeeper', league: 'Premier League', club: 'Man City', value: '35M', clubs: ['Ribeirao', 'Rio Ave', 'Benfica', 'Man City'] },
        { name: 'Bernardo Silva', nationality: 'Portuguese', age: 29, position: 'Midfielder', league: 'Premier League', club: 'Man City', value: '80M', clubs: ['Benfica', 'Monaco', 'Man City'] },
        { name: 'Ruben Dias', nationality: 'Portuguese', age: 27, position: 'Defender', league: 'Premier League', club: 'Man City', value: '80M', clubs: ['Benfica', 'Man City'] },
        { name: 'Josko Gvardiol', nationality: 'Croatian', age: 22, position: 'Defender', league: 'Premier League', club: 'Man City', value: '75M', clubs: ['Dinamo Zagreb', 'Leipzig', 'Man City'] },
        { name: 'Jack Grealish', nationality: 'English', age: 28, position: 'Winger', league: 'Premier League', club: 'Man City', value: '60M', clubs: ['Notts County', 'Aston Villa', 'Man City'] },
        { name: 'Julian Alvarez', nationality: 'Argentine', age: 24, position: 'Striker', league: 'La Liga', club: 'Atletico Madrid', value: '90M', clubs: ['River Plate', 'Man City', 'Atletico Madrid'] },
        { name: 'John Stones', nationality: 'English', age: 30, position: 'Defender', league: 'Premier League', club: 'Man City', value: '38M', clubs: ['Barnsley', 'Everton', 'Man City'] },
        { name: 'Mateo Kovacic', nationality: 'Croatian', age: 30, position: 'Midfielder', league: 'Premier League', club: 'Man City', value: '30M', clubs: ['Dinamo Zagreb', 'Inter Milan', 'Real Madrid', 'Chelsea', 'Man City'] },
        { name: 'Alexander Isak', nationality: 'Swedish', age: 24, position: 'Striker', league: 'Premier League', club: 'Newcastle', value: '75M', clubs: ['AIK', 'Dortmund', 'Willem II', 'Real Sociedad', 'Newcastle'] },
        { name: 'Son Heung-min', nationality: 'South Korean', age: 31, position: 'Forward', league: 'Premier League', club: 'Tottenham', value: '45M', clubs: ['Hamburg', 'Leverkusen', 'Tottenham'] },
        { name: 'James Maddison', nationality: 'English', age: 27, position: 'Midfielder', league: 'Premier League', club: 'Tottenham', value: '70M', clubs: ['Coventry', 'Norwich', 'Aberdeen', 'Leicester', 'Tottenham'] },
        { name: 'Dejan Kulusevski', nationality: 'Swedish', age: 24, position: 'Midfielder', league: 'Premier League', club: 'Tottenham', value: '55M', clubs: ['Atalanta', 'Parma', 'Juventus', 'Tottenham'] },
        { name: 'Cristian Romero', nationality: 'Argentine', age: 26, position: 'Defender', league: 'Premier League', club: 'Tottenham', value: '60M', clubs: ['Belgrano', 'Genoa', 'Juventus', 'Atalanta', 'Tottenham'] },
        { name: 'Guglielmo Vicario', nationality: 'Italian', age: 27, position: 'Goalkeeper', league: 'Premier League', club: 'Tottenham', value: '35M', clubs: ['Udinese', 'Venezia', 'Cagliari', 'Empoli', 'Tottenham'] },
        { name: 'Rasmus Hojlund', nationality: 'Danish', age: 21, position: 'Striker', league: 'Premier League', club: 'Man United', value: '65M', clubs: ['Copenhagen', 'Sturm Graz', 'Atalanta', 'Man United'] },
        { name: 'Alejandro Garnacho', nationality: 'Argentine', age: 19, position: 'Winger', league: 'Premier League', club: 'Man United', value: '45M', clubs: ['Atletico Madrid', 'Man United'] },
        { name: 'Kobbie Mainoo', nationality: 'English', age: 19, position: 'Midfielder', league: 'Premier League', club: 'Man United', value: '35M', clubs: ['Man United'] },
        { name: 'Mason Mount', nationality: 'English', age: 25, position: 'Midfielder', league: 'Premier League', club: 'Man United', value: '35M', clubs: ['Chelsea', 'Vitesse', 'Derby', 'Man United'] },
        { name: 'Andre Onana', nationality: 'Cameroonian', age: 28, position: 'Goalkeeper', league: 'Premier League', club: 'Man United', value: '40M', clubs: ['Ajax', 'Inter Milan', 'Man United'] },
        { name: 'Matthijs de Ligt', nationality: 'Dutch', age: 24, position: 'Defender', league: 'Premier League', club: 'Man United', value: '65M', clubs: ['Ajax', 'Juventus', 'Bayern Munich', 'Man United'] },
        { name: 'Leny Yoro', nationality: 'French', age: 18, position: 'Defender', league: 'Premier League', club: 'Man United', value: '50M', clubs: ['Lille', 'Man United'] },
        { name: 'Joshua Zirkzee', nationality: 'Dutch', age: 23, position: 'Striker', league: 'Premier League', club: 'Man United', value: '40M', clubs: ['Bayern Munich', 'Parma', 'Anderlecht', 'Bologna', 'Man United'] },
        { name: 'Christopher Nkunku', nationality: 'French', age: 26, position: 'Forward', league: 'Premier League', club: 'Chelsea', value: '75M', clubs: ['PSG', 'Leipzig', 'Chelsea'] },
        { name: 'Nicolas Jackson', nationality: 'Senegalese', age: 23, position: 'Striker', league: 'Premier League', club: 'Chelsea', value: '35M', clubs: ['Mirandes', 'Villarreal', 'Chelsea'] },
        { name: 'Enzo Fernandez', nationality: 'Argentine', age: 23, position: 'Midfielder', league: 'Premier League', club: 'Chelsea', value: '80M', clubs: ['River Plate', 'Defensa', 'Benfica', 'Chelsea'] },
        { name: 'Moises Caicedo', nationality: 'Ecuadorian', age: 22, position: 'Midfielder', league: 'Premier League', club: 'Chelsea', value: '90M', clubs: ['Independiente del Valle', 'Beerschot', 'Brighton', 'Chelsea'] },
        { name: 'Levi Colwill', nationality: 'English', age: 21, position: 'Defender', league: 'Premier League', club: 'Chelsea', value: '50M', clubs: ['Brighton', 'Chelsea'] },
        { name: 'Malo Gusto', nationality: 'French', age: 21, position: 'Defender', league: 'Premier League', club: 'Chelsea', value: '35M', clubs: ['Lyon', 'Chelsea'] },
        { name: 'Joao Felix', nationality: 'Portuguese', age: 24, position: 'Forward', league: 'Premier League', club: 'Chelsea', value: '30M', clubs: ['Benfica', 'Atletico Madrid', 'Chelsea', 'Barcelona'] },
        { name: 'Pedro Neto', nationality: 'Portuguese', age: 24, position: 'Forward', league: 'Premier League', club: 'Chelsea', value: '55M', clubs: ['Braga', 'Lazio', 'Wolves', 'Chelsea'] },
        { name: 'Robert Sanchez', nationality: 'Spanish', age: 26, position: 'Goalkeeper', league: 'Premier League', club: 'Chelsea', value: '25M', clubs: ['Forest Green', 'Rochdale', 'Brighton', 'Chelsea'] },
        { name: 'Lamine Yamal', nationality: 'Spanish', age: 16, position: 'Winger', league: 'La Liga', club: 'Barcelona', value: '120M', clubs: ['Barcelona'] },
        { name: 'Gavi', nationality: 'Spanish', age: 19, position: 'Midfielder', league: 'La Liga', club: 'Barcelona', value: '90M', clubs: ['Barcelona'] },
        { name: 'Frenkie de Jong', nationality: 'Dutch', age: 27, position: 'Midfielder', league: 'La Liga', club: 'Barcelona', value: '70M', clubs: ['Willem II', 'Ajax', 'Barcelona'] },
        { name: 'Ilkay Gundogan', nationality: 'German', age: 35, position: 'Midfielder', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '8M', clubs: ['Nurnberg', 'Dortmund', 'Man City', 'Barcelona', 'Bayer Leverkusen'] },
        { name: 'Raphinha', nationality: 'Brazilian', age: 27, position: 'Winger', league: 'La Liga', club: 'Barcelona', value: '50M', clubs: ['Avai', 'Vitoria Guimaraes', 'Sporting CP', 'Rennes', 'Leeds', 'Barcelona'] },
        { name: 'Ronald Araujo', nationality: 'Uruguayan', age: 25, position: 'Defender', league: 'La Liga', club: 'Barcelona', value: '70M', clubs: ['Rentistas', 'Boston River', 'Barcelona'] },
        { name: 'Jules Kounde', nationality: 'French', age: 25, position: 'Defender', league: 'La Liga', club: 'Barcelona', value: '50M', clubs: ['Bordeaux', 'Sevilla', 'Barcelona'] },
        { name: 'Alejandro Balde', nationality: 'Spanish', age: 20, position: 'Defender', league: 'La Liga', club: 'Barcelona', value: '40M', clubs: ['Barcelona'] },
        { name: 'Marc-Andre ter Stegen', nationality: 'German', age: 32, position: 'Goalkeeper', league: 'La Liga', club: 'Barcelona', value: '28M', clubs: ['Gladbach', 'Barcelona'] },
        { name: 'Federico Valverde', nationality: 'Uruguayan', age: 25, position: 'Midfielder', league: 'La Liga', club: 'Real Madrid', value: '120M', clubs: ['Penarol', 'Deportivo La Coruna', 'Real Madrid'] },
        { name: 'Aurelien Tchouameni', nationality: 'French', age: 24, position: 'Midfielder', league: 'La Liga', club: 'Real Madrid', value: '90M', clubs: ['Bordeaux', 'Monaco', 'Real Madrid'] },
        { name: 'Eduardo Camavinga', nationality: 'French', age: 21, position: 'Midfielder', league: 'La Liga', club: 'Real Madrid', value: '90M', clubs: ['Rennes', 'Real Madrid'] },
        { name: 'Arda Guler', nationality: 'Turkish', age: 19, position: 'Midfielder', league: 'La Liga', club: 'Real Madrid', value: '45M', clubs: ['Fenerbahce', 'Real Madrid'] },
        { name: 'Brahim Diaz', nationality: 'Moroccan', age: 24, position: 'Forward', league: 'La Liga', club: 'Real Madrid', value: '40M', clubs: ['Malaga', 'Man City', 'Real Madrid', 'AC Milan'] },
        { name: 'Rodrygo Goes', nationality: 'Brazilian', age: 23, position: 'Forward', league: 'La Liga', club: 'Real Madrid', value: '110M', clubs: ['Santos', 'Real Madrid'] },
        { name: 'Eder Militao', nationality: 'Brazilian', age: 26, position: 'Defender', league: 'La Liga', club: 'Real Madrid', value: '60M', clubs: ['Sao Paulo', 'Porto', 'Real Madrid'] },
        { name: 'Antonio Rudiger', nationality: 'German', age: 31, position: 'Defender', league: 'La Liga', club: 'Real Madrid', value: '25M', clubs: ['Stuttgart', 'Roma', 'Chelsea', 'Real Madrid'] },
        { name: 'Ferland Mendy', nationality: 'French', age: 29, position: 'Defender', league: 'La Liga', club: 'Real Madrid', value: '22M', clubs: ['Lehavre', 'Lyon', 'Real Madrid'] },
        { name: 'Dani Carvajal', nationality: 'Spanish', age: 32, position: 'Defender', league: 'La Liga', club: 'Real Madrid', value: '12M', clubs: ['Real Madrid', 'Leverkusen'] },
        { name: 'Thibaut Courtois', nationality: 'Belgian', age: 32, position: 'Goalkeeper', league: 'La Liga', club: 'Real Madrid', value: '28M', clubs: ['Genk', 'Atletico Madrid', 'Chelsea', 'Real Madrid'] },
        { name: 'Andriy Lunin', nationality: 'Ukrainian', age: 25, position: 'Goalkeeper', league: 'La Liga', club: 'Real Madrid', value: '25M', clubs: ['Dnipro', 'Zorya Luhansk', 'Real Madrid', 'Leganes', 'Valladolid', 'Oviedo'] },
        { name: 'Nico Williams', nationality: 'Spanish', age: 21, position: 'Winger', league: 'La Liga', club: 'Athletic Bilbao', value: '70M', clubs: ['Athletic Bilbao'] },
        { name: 'Oihan Sancet', nationality: 'Spanish', age: 24, position: 'Midfielder', league: 'La Liga', club: 'Athletic Bilbao', value: '35M', clubs: ['Athletic Bilbao'] },
        { name: 'Takefusa Kubo', nationality: 'Japanese', age: 23, position: 'Winger', league: 'La Liga', club: 'Real Sociedad', value: '60M', clubs: ['FC Tokyo', 'Yokohama F. Marinos', 'Real Madrid', 'Mallorca', 'Villarreal', 'Getafe', 'Real Sociedad'] },
        { name: 'Martin Zubimendi', nationality: 'Spanish', age: 25, position: 'Midfielder', league: 'La Liga', club: 'Real Sociedad', value: '50M', clubs: ['Real Sociedad'] },
        { name: 'Mikel Merino', nationality: 'Spanish', age: 29, position: 'Midfielder', league: 'Premier League', club: 'Arsenal', value: '50M', clubs: ['Osasuna', 'Dortmund', 'Newcastle', 'Real Sociedad', 'Arsenal'] },
        { name: 'Robin Le Normand', nationality: 'Spanish', age: 27, position: 'La Liga', club: 'Atletico Madrid', value: '40M', clubs: ['Brest', 'Real Sociedad', 'Atletico Madrid'] },
        { name: 'Alexander Sorloth', nationality: 'Norwegian', age: 28, position: 'Striker', league: 'La Liga', club: 'Atletico Madrid', value: '25M', clubs: ['Rosenborg', 'Bodo/Glimt', 'Groningen', 'Midtjylland', 'Crystal Palace', 'Gent', 'Trabzonspor', 'Leipzig', 'Real Sociedad', 'Villarreal', 'Atletico Madrid'] },
        { name: 'Conor Gallagher', nationality: 'English', age: 24, position: 'Midfielder', league: 'La Liga', club: 'Atletico Madrid', value: '50M', clubs: ['Charlton', 'Swansea', 'West Brom', 'Crystal Palace', 'Chelsea', 'Atletico Madrid'] },
        { name: 'Jan Oblak', nationality: 'Slovenian', age: 31, position: 'Goalkeeper', league: 'La Liga', club: 'Atletico Madrid', value: '28M', clubs: ['Olimpija Ljubljana', 'Benfica', 'Atletico Madrid'] },
        { name: 'Rodrigo De Paul', nationality: 'Argentine', age: 30, position: 'Midfielder', league: 'La Liga', club: 'Atletico Madrid', value: '30M', clubs: ['Racing Club', 'Valencia', 'Udinese', 'Atletico Madrid'] },
        { name: 'Marcos Llorente', nationality: 'Spanish', age: 29, position: 'Midfielder', league: 'La Liga', club: 'Atletico Madrid', value: '30M', clubs: ['Real Madrid', 'Alaves', 'Atletico Madrid'] },
        { name: 'Alvaro Morata', nationality: 'Spanish', age: 31, position: 'Striker', league: 'Serie A', club: 'AC Milan', value: '16M', clubs: ['Real Madrid', 'Juventus', 'Chelsea', 'Atletico Madrid', 'AC Milan'] },
        { name: 'Dusan Vlahovic', nationality: 'Serbian', age: 24, position: 'Striker', league: 'Serie A', club: 'Juventus', value: '65M', clubs: ['Partizan', 'Fiorentina', 'Juventus'] },
        { name: 'Kenan Yildiz', nationality: 'Turkish', age: 19, position: 'Forward', league: 'Serie A', club: 'Juventus', value: '40M', clubs: ['Bayern Munich', 'Juventus'] },
        { name: 'Teun Koopmeiners', nationality: 'Dutch', age: 26, position: 'Midfielder', league: 'Serie A', club: 'Juventus', value: '55M', clubs: ['AZ Alkmaar', 'Atalanta', 'Juventus'] },
        { name: 'Douglas Luiz', nationality: 'Brazilian', age: 26, position: 'Midfielder', league: 'Serie A', club: 'Juventus', value: '70M', clubs: ['Vasco da Gama', 'Girona', 'Aston Villa', 'Juventus'] },
        { name: 'Bremer', nationality: 'Brazilian', age: 27, position: 'Defender', league: 'Serie A', club: 'Juventus', value: '60M', clubs: ['Atletico Mineiro', 'Torino', 'Juventus'] },
        { name: 'Manuel Locatelli', nationality: 'Italian', age: 26, position: 'Midfielder', league: 'Serie A', club: 'Juventus', value: '28M', clubs: ['Milan', 'Sassuolo', 'Juventus'] },
        { name: 'Federico Chiesa', nationality: 'Italian', age: 26, position: 'Winger', league: 'Premier League', club: 'Liverpool', value: '35M', clubs: ['Fiorentina', 'Juventus', 'Liverpool'] },
        { name: 'Nicolo Barella', nationality: 'Italian', age: 27, position: 'Midfielder', league: 'Serie A', club: 'Inter Milan', value: '80M', clubs: ['Cagliari', 'Como', 'Inter Milan'] },
        { name: 'Hakan Calhanoglu', nationality: 'Turkish', age: 30, position: 'Midfielder', league: 'Serie A', club: 'Inter Milan', value: '45M', clubs: ['Karlsruher', 'Hamburg', 'Leverkusen', 'Milan', 'Inter Milan'] },
        { name: 'Alessandro Bastoni', nationality: 'Italian', age: 25, position: 'Defender', league: 'Serie A', club: 'Inter Milan', value: '70M', clubs: ['Atalanta', 'Parma', 'Inter Milan'] },
        { name: 'Benjamin Pavard', nationality: 'French', age: 28, position: 'Defender', league: 'Serie A', club: 'Inter Milan', value: '50M', clubs: ['Lille', 'Stuttgart', 'Bayern Munich', 'Inter Milan'] },
        { name: 'Yann Sommer', nationality: 'Swiss', age: 35, position: 'Goalkeeper', league: 'Serie A', club: 'Inter Milan', value: '5M', clubs: ['Basel', 'Vaduz', 'Gladbach', 'Bayern Munich', 'Inter Milan'] },
        { name: 'Theo Hernandez', nationality: 'French', age: 26, position: 'Defender', league: 'Serie A', club: 'AC Milan', value: '60M', clubs: ['Atletico Madrid', 'Alaves', 'Real Madrid', 'Real Sociedad', 'AC Milan'] },
        { name: 'Mike Maignan', nationality: 'French', age: 28, position: 'Goalkeeper', league: 'Serie A', club: 'AC Milan', value: '38M', clubs: ['Lille', 'AC Milan'] },
        { name: 'Christian Pulisic', nationality: 'American', age: 25, position: 'Winger', league: 'Serie A', club: 'AC Milan', value: '40M', clubs: ['Dortmund', 'Chelsea', 'AC Milan'] },
        { name: 'Fikayo Tomori', nationality: 'English', age: 26, position: 'Defender', league: 'Serie A', club: 'AC Milan', value: '40M', clubs: ['Chelsea', 'Brighton', 'Hull', 'Derby', 'AC Milan'] },
        { name: 'Ismael Bennacer', nationality: 'Algerian', age: 26, position: 'Midfielder', league: 'Serie A', club: 'AC Milan', value: '35M', clubs: ['Arles-Avignon', 'Arsenal', 'Tours', 'Empoli', 'AC Milan'] },
        { name: 'Romelu Lukaku', nationality: 'Belgian', age: 31, position: 'Striker', league: 'Serie A', club: 'Napoli', value: '30M', clubs: ['Anderlecht', 'Chelsea', 'West Brom', 'Everton', 'Man United', 'Inter Milan', 'Roma', 'Napoli'] },
        { name: 'Scott McTominay', nationality: 'Scottish', age: 27, position: 'Midfielder', league: 'Serie A', club: 'Napoli', value: '32M', clubs: ['Man United', 'Napoli'] },
        { name: 'Billy Gilmour', nationality: 'Scottish', age: 23, position: 'Midfielder', league: 'Serie A', club: 'Napoli', value: '18M', clubs: ['Chelsea', 'Norwich', 'Brighton', 'Napoli'] },
        { name: 'Stanislav Lobotka', nationality: 'Slovakian', age: 29, position: 'Midfielder', league: 'Serie A', club: 'Napoli', value: '28M', clubs: ['Trencin', 'Nordsjalland', 'Celta Vigo', 'Napoli'] },
        { name: 'Giovanni Di Lorenzo', nationality: 'Italian', age: 30, position: 'Defender', league: 'Serie A', club: 'Napoli', value: '15M', clubs: ['Reggina', 'Cuneo', 'Matera', 'Empoli', 'Napoli'] },
        { name: 'Alex Meret', nationality: 'Italian', age: 27, position: 'Goalkeeper', league: 'Serie A', club: 'Napoli', value: '12M', clubs: ['Udinese', 'Spal', 'Napoli'] },
        { name: 'Leroy Sane', nationality: 'German', age: 28, position: 'Winger', league: 'Bundesliga', club: 'Bayern Munich', value: '70M', clubs: ['Schalke', 'Man City', 'Bayern Munich'] },
        { name: 'Serge Gnabry', nationality: 'German', age: 28, position: 'Winger', league: 'Bundesliga', club: 'Bayern Munich', value: '40M', clubs: ['Arsenal', 'West Brom', 'Werder Bremen', 'Hoffenheim', 'Bayern Munich'] },
        { name: 'Kingsley Coman', nationality: 'French', age: 28, position: 'Winger', league: 'Bundesliga', club: 'Bayern Munich', value: '50M', clubs: ['PSG', 'Juventus', 'Bayern Munich'] },
        { name: 'Michael Olise', nationality: 'French', age: 22, position: 'Winger', league: 'Bundesliga', club: 'Bayern Munich', value: '55M', clubs: ['Reading', 'Crystal Palace', 'Bayern Munich'] },
        { name: 'Joao Palhinha', nationality: 'Portuguese', age: 28, position: 'Midfielder', league: 'Bundesliga', club: 'Bayern Munich', value: '55M', clubs: ['Sporting CP', 'Moreirense', 'Belenenses', 'Braga', 'Fulham', 'Bayern Munich'] },
        { name: 'Joshua Kimmich', nationality: 'German', age: 29, position: 'Midfielder', league: 'Bundesliga', club: 'Bayern Munich', value: '50M', clubs: ['Stuttgart', 'RB Leipzig', 'Bayern Munich'] },
        { name: 'Leon Goretzka', nationality: 'German', age: 29, position: 'Midfielder', league: 'Bundesliga', club: 'Bayern Munich', value: '30M', clubs: ['Bochum', 'Schalke', 'Bayern Munich'] },
        { name: 'Alphonso Davies', nationality: 'Canadian', age: 23, position: 'Defender', league: 'Bundesliga', club: 'Bayern Munich', value: '50M', clubs: ['Vancouver Whitecaps', 'Bayern Munich'] },
        { name: 'Dayot Upamecano', nationality: 'French', age: 25, position: 'Defender', league: 'Bundesliga', club: 'Bayern Munich', value: '45M', clubs: ['Liefering', 'Salzburg', 'Leipzig', 'Bayern Munich'] },
        { name: 'Kim Min-jae', nationality: 'South Korean', age: 27, position: 'Defender', league: 'Bundesliga', club: 'Bayern Munich', value: '55M', clubs: ['Gyeongju KHNP', 'Jeonbuk', 'Beijing Guoan', 'Fenerbahce', 'Napoli', 'Bayern Munich'] },
        { name: 'Manuel Neuer', nationality: 'German', age: 38, position: 'Goalkeeper', league: 'Bundesliga', club: 'Bayern Munich', value: '4M', clubs: ['Schalke', 'Bayern Munich'] },
        { name: 'Granit Xhaka', nationality: 'Swiss', age: 31, position: 'Midfielder', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '20M', clubs: ['Basel', 'Gladbach', 'Arsenal', 'Leverkusen'] },
        { name: 'Alejandro Grimaldo', nationality: 'Spanish', age: 28, position: 'Defender', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '45M', clubs: ['Barcelona', 'Benfica', 'Leverkusen'] },
        { name: 'Jeremie Frimpong', nationality: 'Dutch', age: 23, position: 'Defender', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '50M', clubs: ['Man City', 'Celtic', 'Leverkusen'] },
        { name: 'Victor Boniface', nationality: 'Nigerian', age: 23, position: 'Striker', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '40M', clubs: ['Real Bodomin', 'Union SG', 'Leverkusen'] },
        { name: 'Patrik Schick', nationality: 'Czech', age: 28, position: 'Striker', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '22M', clubs: ['Sparta Prague', 'Bohemians', 'Sampdoria', 'Roma', 'Leipzig', 'Leverkusen'] },
        { name: 'Robert Andrich', nationality: 'German', age: 29, position: 'Midfielder', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '17M', clubs: ['Hertha BSC', 'Dresden', 'Wehen Wiesbaden', 'Heidenheim', 'Union Berlin', 'Leverkusen'] },
        { name: 'Jonathan Tah', nationality: 'German', age: 28, position: 'Defender', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '30M', clubs: ['Hamburg', 'Dusseldorf', 'Leverkusen'] },
        { name: 'Lukas Hradecky', nationality: 'Finnish', age: 34, position: 'Goalkeeper', league: 'Bundesliga', club: 'Bayer Leverkusen', value: '2.5M', clubs: ['Esbjerg', 'Brondby', 'Frankfurt', 'Leverkusen'] },
        { name: 'Lucas Chevalier', nationality: 'French', age: 22, position: 'Goalkeeper', league: 'Ligue 1', club: 'Lille', value: '35M', clubs: ['Lille', 'Valenciennes'] },
        { name: 'Jonathan David', nationality: 'Canadian', age: 24, position: 'Striker', league: 'Ligue 1', club: 'Lille', value: '50M', clubs: ['Gent', 'Lille'] },
        { name: 'Angel Gomes', nationality: 'English', age: 23, position: 'Midfielder', league: 'Ligue 1', club: 'Lille', value: '25M', clubs: ['Man United', 'Boavista', 'Lille'] },
        { name: 'Jurrien Timber', nationality: 'Dutch', age: 23, position: 'Defender', league: 'Premier League', club: 'Arsenal', value: '38M', clubs: ['Ajax', 'Arsenal'] },
        { name: 'David Raya', nationality: 'Spanish', age: 28, position: 'Goalkeeper', league: 'Premier League', club: 'Arsenal', value: '35M', clubs: ['Blackburn', 'Southport', 'Brentford', 'Arsenal'] },
        { name: 'Riccardo Calafiori', nationality: 'Italian', age: 22, position: 'Defender', league: 'Premier League', club: 'Arsenal', value: '45M', clubs: ['Roma', 'Genoa', 'Basel', 'Bologna', 'Arsenal'] },
        { name: 'Rico Lewis', nationality: 'English', age: 19, position: 'Defender', league: 'Premier League', club: 'Man City', value: '38M', clubs: ['Man City'] },
        { name: 'Endrick', nationality: 'Brazilian', age: 17, position: 'Forward', league: 'La Liga', club: 'Real Madrid', value: '60M', clubs: ['Palmeiras', 'Real Madrid'] },
        { name: 'Axel Disasi', nationality: 'French', age: 26, position: 'Defender', league: 'Premier League', club: 'Chelsea', value: '40M', clubs: ['Paris FC', 'Reims', 'Monaco', 'Chelsea'] },
        { name: 'Benoit Badiashile', nationality: 'French', age: 23, position: 'Defender', league: 'Premier League', club: 'Chelsea', value: '30M', clubs: ['Monaco', 'Chelsea'] },
        { name: 'Wesley Fofana', nationality: 'French', age: 23, position: 'Defender', league: 'Premier League', club: 'Chelsea', value: '30M', clubs: ['Saint-Etienne', 'Leicester', 'Chelsea'] },
        { name: 'Sacha Boey', nationality: 'French', age: 23, position: 'Defender', league: 'Bundesliga', club: 'Bayern Munich', value: '22M', clubs: ['Rennes', 'Dijon', 'Galatasaray', 'Bayern Munich'] },
        { name: 'Mathys Tel', nationality: 'French', age: 19, position: 'Forward', league: 'Bundesliga', club: 'Bayern Munich', value: '40M', clubs: ['Rennes', 'Bayern Munich'] },
        { name: 'Warren Zaire-Emery', nationality: 'French', age: 18, position: 'Midfielder', league: 'Ligue 1', club: 'PSG', value: '60M', clubs: ['PSG'] },
        { name: 'Bradley Barcola', nationality: 'French', age: 21, position: 'Forward', league: 'Ligue 1', club: 'PSG', value: '65M', clubs: ['Lyon', 'PSG'] },
        { name: 'Randal Kolo Muani', nationality: 'French', age: 25, position: 'Striker', league: 'Ligue 1', club: 'PSG', value: '40M', clubs: ['Nantes', 'Boulogne', 'Frankfurt', 'PSG'] },
        { name: 'Ousmane Dembele', nationality: 'French', age: 27, position: 'Winger', league: 'Ligue 1', club: 'PSG', value: '60M', clubs: ['Rennes', 'Dortmund', 'Barcelona', 'PSG'] },
        { name: 'Lucas Hernandez', nationality: 'French', age: 28, position: 'Defender', league: 'Ligue 1', club: 'PSG', value: '40M', clubs: ['Atletico Madrid', 'Bayern Munich', 'PSG'] },
        { name: 'Presnel Kimpembe', nationality: 'French', age: 28, position: 'Defender', league: 'Ligue 1', club: 'PSG', value: '20M', clubs: ['PSG'] },
        { name: 'Ollie Watkins', nationality: 'English', age: 28, position: 'Striker', league: 'Premier League', club: 'Aston Villa', value: '65M', clubs: ['Exeter City', 'Weston-super-Mare', 'Brentford', 'Aston Villa'] },
        { name: 'Ezri Konsa', nationality: 'English', age: 26, position: 'Defender', league: 'Premier League', club: 'Aston Villa', value: '35M', clubs: ['Charlton', 'Brentford', 'Aston Villa'] },
        { name: 'Jacob Ramsey', nationality: 'English', age: 23, position: 'Midfielder', league: 'Premier League', club: 'Aston Villa', value: '35M', clubs: ['Aston Villa', 'Doncaster'] },
        { name: 'Morgan Rogers', nationality: 'English', age: 21, position: 'Forward', league: 'Premier League', club: 'Aston Villa', value: '22M', clubs: ['West Brom', 'Man City', 'Lincoln City', 'Bournemouth', 'Blackpool', 'Middlesbrough', 'Aston Villa'] },
        { name: 'Federico Dimarco', nationality: 'Italian', age: 26, position: 'Defender', league: 'Serie A', club: 'Inter Milan', value: '50M', clubs: ['Inter Milan', 'Ascoli', 'Empoli', 'Sion', 'Parma', 'Verona'] },
        { name: 'Davide Frattesi', nationality: 'Italian', age: 24, position: 'Midfielder', league: 'Serie A', club: 'Inter Milan', value: '35M', clubs: ['Roma', 'Sassuolo', 'Ascoli', 'Empoli', 'Monza', 'Inter Milan'] },
        { name: 'Francesco Acerbi', nationality: 'Italian', age: 36, position: 'Defender', league: 'Serie A', club: 'Inter Milan', value: '4M', clubs: ['Pavia', 'Reggina', 'Chievo', 'Genoa', 'Milan', 'Sassuolo', 'Lazio', 'Inter Milan'] },
        { name: 'Matteo Darmian', nationality: 'Italian', age: 34, position: 'Defender', league: 'Serie A', club: 'Inter Milan', value: '4M', clubs: ['Milan', 'Padova', 'Palermo', 'Torino', 'Man United', 'Parma', 'Inter Milan'] },
        { name: 'Andrea Cambiaso', nationality: 'Italian', age: 24, position: 'Defender', league: 'Serie A', club: 'Juventus', value: '30M', clubs: ['Genoa', 'Albissola', 'Savona', 'Alessandria', 'Empoli', 'Bologna', 'Juventus'] },
        { name: 'Nicolo Fagioli', nationality: 'Italian', age: 23, position: 'Midfielder', league: 'Serie A', club: 'Juventus', value: '15M', clubs: ['Cremonese', 'Juventus'] },
        { name: 'Federico Gatti', nationality: 'Italian', age: 26, position: 'Defender', league: 'Serie A', club: 'Juventus', value: '18M', clubs: ['Pavone', 'Verbania', 'Pro Patria', 'Frosinone', 'Juventus'] },
        { name: 'Mattia Perin', nationality: 'Italian', age: 31, position: 'Goalkeeper', league: 'Serie A', club: 'Juventus', value: '3M', clubs: ['Genoa', 'Padova', 'Pescara', 'Juventus'] },
        { name: 'Fermin Lopez', nationality: 'Spanish', age: 21, position: 'Midfielder', league: 'La Liga', club: 'Barcelona', value: '30M', clubs: ['Barcelona', 'Linares'] },
        { name: 'Marc Casado', nationality: 'Spanish', age: 20, position: 'Midfielder', league: 'La Liga', club: 'Barcelona', value: '15M', clubs: ['Barcelona'] },
        { name: 'Xavi Simons', nationality: 'Dutch', age: 21, position: 'Midfielder', league: 'Bundesliga', club: 'RB Leipzig', value: '80M', clubs: ['Barcelona', 'PSG', 'PSV', 'Leipzig'] },
        { name: 'Lois Openda', nationality: 'Belgian', age: 24, position: 'Striker', league: 'Bundesliga', club: 'RB Leipzig', value: '60M', clubs: ['Club Brugge', 'Vitesse', 'Lens', 'Leipzig'] },
        { name: 'Benjamin Sesko', nationality: 'Slovenian', age: 21, position: 'Striker', league: 'Bundesliga', club: 'RB Leipzig', value: '50M', clubs: ['Domzale', 'Salzburg', 'Liefering', 'Leipzig'] },
        { name: 'Castello Lukeba', nationality: 'French', age: 21, position: 'Defender', league: 'Bundesliga', club: 'RB Leipzig', value: '40M', clubs: ['Lyon', 'Leipzig'] },
        { name: 'Willi Orban', nationality: 'Hungarian', age: 31, position: 'Defender', league: 'Bundesliga', club: 'RB Leipzig', value: '10M', clubs: ['Kaiserslautern', 'Leipzig'] },
        { name: 'Peter Gulacsi', nationality: 'Hungarian', age: 34, position: 'Goalkeeper', league: 'Bundesliga', club: 'RB Leipzig', value: '3M', clubs: ['MTK Budapest', 'Liverpool', 'Hereford', 'Tranmere', 'Hull', 'Salzburg', 'Leipzig'] }
      ];

      // ──────────────────────────  a• a• a• a• a• a•  STATE a• a• a• a• a• a• a• 


      const LOGO_URLS = {

        'premier-league': 'https://crests.football-data.org/PL.png',

        'la-liga': 'https://crests.football-data.org/PD.png',

        'ucl': 'https://crests.football-data.org/CL.png',

        'world-cup': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/960px-2026_FIFA_World_Cup_emblem.svg.png',

        'bundesliga': 'https://crests.football-data.org/BL1.png',

        'serie-a': 'https://crests.football-data.org/SA.png',

        'ligue-1': 'https://crests.football-data.org/FL1.png',
        'man-utd': 'https://crests.football-data.org/66.png',
        'man-city': 'https://crests.football-data.org/65.png',
        'chelsea': 'https://crests.football-data.org/61.png',
        'arsenal': 'https://crests.football-data.org/57.png',
        'liverpool': 'https://crests.football-data.org/64.png',
        'real-madrid': 'https://crests.football-data.org/86.png',
        'barcelona': 'https://crests.football-data.org/81.png',
        'atletico': 'https://crests.football-data.org/78.png',
      };

      const COUNTRY_CODES = {
        'Mexico': 'mx', 'Switzerland': 'ch', 'Senegal': 'sn', 'Japan': 'jp',
        'Canada': 'ca', 'Germany': 'de', 'Colombia': 'co', 'Australia': 'au',
        'United States': 'us', 'Spain': 'es', 'Uruguay': 'uy', 'Nigeria': 'ng',
        'France': 'fr', 'Austria': 'at', 'Egypt': 'eg', 'Ecuador': 'ec',
        'Brazil': 'br', 'Poland': 'pl', 'South Korea': 'kr', 'Morocco': 'ma',
        'England': 'gb-eng', 'Ukraine': 'ua', 'Jamaica': 'jm', 'Iraq': 'iq',
        'Portugal': 'pt', 'Turkey': 'tr', 'Ivory Coast': 'ci', 'Scotland': 'gb-sct',
        'Italy': 'it', 'Denmark': 'dk', 'Cameroon': 'cm', 'Iran': 'ir',
        'Argentina': 'ar', 'Sweden': 'se', 'Algeria': 'dz', 'Saudi Arabia': 'sa',
        'Belgium': 'be', 'Croatia': 'hr', 'South Africa': 'za', 'Panama': 'pa',
        'Netherlands': 'nl', 'Peru': 'pe', 'Ghana': 'gh', 'Costa Rica': 'cr',
        'Chile': 'cl', 'New Zealand': 'nz', 'Tunisia': 'tn', 'Mali': 'ml',
        'Czechia': 'cz', 'Bosnia & Herzegovina': 'ba', 'Qatar': 'qa', 'Haiti': 'ht',
        'Paraguay': 'py', 'Türkiye': 'tr', 'Curaçao': 'cw', 'Cape Verde': 'cv',
        'Norway': 'no', 'Jordan': 'jo', 'Uzbekistan': 'uz', 'DR Congo': 'cd'
      };

      const WC_TEAMS = [
        { name: 'Argentina', ranking: 1, confederation: 'CONMEBOL', recent: 'World Cup 2022 Champions, Copa America 2024 Winners' },
        { name: 'France', ranking: 2, confederation: 'UEFA', recent: 'World Cup 2022 Runners-up, Euro 2024 Semi-finalists' },
        { name: 'England', ranking: 3, confederation: 'UEFA', recent: 'Euro 2024 Runners-up, World Cup 2022 Quarter-finalists' },
        { name: 'Portugal', ranking: 4, confederation: 'UEFA', recent: 'Euro 2024 Quarter-finalists' },
        { name: 'Brazil', ranking: 5, confederation: 'CONMEBOL', recent: 'World Cup 2022 Quarter-finalists' },
        { name: 'Belgium', ranking: 6, confederation: 'UEFA', recent: 'Euro 2024 Round of 16' },
        { name: 'Netherlands', ranking: 7, confederation: 'UEFA', recent: 'Euro 2024 Semi-finalists, World Cup 2022 Quarter-finalists' },
        { name: 'Spain', ranking: 8, confederation: 'UEFA', recent: 'Euro 2024 Winners, Nations League 2023 Winners' },
        { name: 'Croatia', ranking: 10, confederation: 'UEFA', recent: 'World Cup 2022 3rd Place, Nations League 2023 Runners-up' },
        { name: 'Uruguay', ranking: 11, confederation: 'CONMEBOL', recent: 'Copa America 2024 3rd Place' },
        { name: 'Germany', ranking: 12, confederation: 'UEFA', recent: 'Euro 2024 Quarter-finalists' },
        { name: 'Morocco', ranking: 13, confederation: 'CAF', recent: 'World Cup 2022 4th Place' },
        { name: 'Colombia', ranking: 14, confederation: 'CONMEBOL', recent: 'Copa America 2024 Runners-up' },
        { name: 'Mexico', ranking: 15, confederation: 'CONCACAF', recent: 'Gold Cup 2023 Winners' },
        { name: 'United States', ranking: 16, confederation: 'CONCACAF', recent: 'CONCACAF Nations League 2024 Winners' },
        { name: 'Japan', ranking: 17, confederation: 'AFC', recent: 'Asian Cup 2023 Quarter-finalists' },
        { name: 'Senegal', ranking: 18, confederation: 'CAF', recent: 'AFCON 2023 Round of 16' },
        { name: 'Switzerland', ranking: 19, confederation: 'UEFA', recent: 'Euro 2024 Quarter-finalists' },
        { name: 'Iran', ranking: 20, confederation: 'AFC', recent: 'Asian Cup 2023 Semi-finalists' },
        { name: 'South Korea', ranking: 22, confederation: 'AFC', recent: 'Asian Cup 2023 Semi-finalists' },
        { name: 'Australia', ranking: 23, confederation: 'AFC', recent: 'Asian Cup 2023 Quarter-finalists' },
        { name: 'Austria', ranking: 25, confederation: 'UEFA', recent: 'Euro 2024 Round of 16' },
        { name: 'Sweden', ranking: 26, confederation: 'UEFA', recent: 'Nations League B' },
        { name: 'Türkiye', ranking: 27, confederation: 'UEFA', recent: 'Euro 2024 Quarter-finalists' },
        { name: 'Ecuador', ranking: 31, confederation: 'CONMEBOL', recent: 'Copa America 2024 Quarter-finalists' },
        { name: 'Czechia', ranking: 34, confederation: 'UEFA', recent: 'Euro 2024 Group Stage' },
        { name: 'Qatar', ranking: 35, confederation: 'AFC', recent: 'Asian Cup 2023 Winners' },
        { name: 'Panama', ranking: 35, confederation: 'CONCACAF', recent: 'Copa America 2024 Quarter-finalists' },
        { name: 'Egypt', ranking: 36, confederation: 'CAF', recent: 'AFCON 2023 Round of 16' },
        { name: 'Ivory Coast', ranking: 38, confederation: 'CAF', recent: 'AFCON 2023 Winners' },
        { name: 'Scotland', ranking: 39, confederation: 'UEFA', recent: 'Euro 2024 Group Stage' },
        { name: 'Tunisia', ranking: 41, confederation: 'CAF', recent: 'AFCON 2023 Group Stage' },
        { name: 'Algeria', ranking: 43, confederation: 'CAF', recent: 'AFCON 2023 Group Stage' },
        { name: 'Norway', ranking: 47, confederation: 'UEFA', recent: 'Nations League B' },
        { name: 'Canada', ranking: 48, confederation: 'CONCACAF', recent: 'Copa America 2024 4th Place' },
        { name: 'Saudi Arabia', ranking: 53, confederation: 'AFC', recent: 'Asian Cup 2023 Round of 16' },
        { name: 'Iraq', ranking: 58, confederation: 'AFC', recent: 'Asian Cup 2023 Round of 16' },
        { name: 'South Africa', ranking: 59, confederation: 'CAF', recent: 'AFCON 2023 3rd Place' },
        { name: 'Uzbekistan', ranking: 60, confederation: 'AFC', recent: 'Asian Cup 2023 Quarter-finalists' },
        { name: 'DR Congo', ranking: 61, confederation: 'CAF', recent: 'AFCON 2023 4th Place' },
        { name: 'Paraguay', ranking: 62, confederation: 'CONMEBOL', recent: 'Copa America 2024 Group Stage' },
        { name: 'Ghana', ranking: 64, confederation: 'CAF', recent: 'AFCON 2023 Group Stage' },
        { name: 'Cape Verde', ranking: 65, confederation: 'CAF', recent: 'AFCON 2023 Quarter-finalists' },
        { name: 'Jordan', ranking: 68, confederation: 'AFC', recent: 'Asian Cup 2023 Runners-up' },
        { name: 'Bosnia & Herzegovina', ranking: 75, confederation: 'UEFA', recent: 'Euro 2024 Play-offs' },
        { name: 'Haiti', ranking: 86, confederation: 'CONCACAF', recent: 'Gold Cup 2023 Group Stage' },
        { name: 'Curaçao', ranking: 88, confederation: 'CONCACAF', recent: 'CONCACAF Nations League B' },
        { name: 'New Zealand', ranking: 94, confederation: 'OFC', recent: 'OFC Nations Cup Winners' }
      ];

      const WC_GROUPS = {
        A: { name: 'Group A', teams: [ { name: 'Mexico', p: 0, gd: 0, pts: 0 }, { name: 'South Africa', p: 0, gd: 0, pts: 0 }, { name: 'South Korea', p: 0, gd: 0, pts: 0 }, { name: 'Czechia', p: 0, gd: 0, pts: 0 } ] },
        B: { name: 'Group B', teams: [ { name: 'Canada', p: 0, gd: 0, pts: 0 }, { name: 'Bosnia & Herzegovina', p: 0, gd: 0, pts: 0 }, { name: 'Qatar', p: 0, gd: 0, pts: 0 }, { name: 'Switzerland', p: 0, gd: 0, pts: 0 } ] },
        C: { name: 'Group C', teams: [ { name: 'Brazil', p: 0, gd: 0, pts: 0 }, { name: 'Morocco', p: 0, gd: 0, pts: 0 }, { name: 'Scotland', p: 0, gd: 0, pts: 0 }, { name: 'Haiti', p: 0, gd: 0, pts: 0 } ] },
        D: { name: 'Group D', teams: [ { name: 'United States', p: 0, gd: 0, pts: 0 }, { name: 'Paraguay', p: 0, gd: 0, pts: 0 }, { name: 'Australia', p: 0, gd: 0, pts: 0 }, { name: 'Türkiye', p: 0, gd: 0, pts: 0 } ] },
        E: { name: 'Group E', teams: [ { name: 'Germany', p: 0, gd: 0, pts: 0 }, { name: 'Ecuador', p: 0, gd: 0, pts: 0 }, { name: 'Ivory Coast', p: 0, gd: 0, pts: 0 }, { name: 'Curaçao', p: 0, gd: 0, pts: 0 } ] },
        F: { name: 'Group F', teams: [ { name: 'Netherlands', p: 0, gd: 0, pts: 0 }, { name: 'Japan', p: 0, gd: 0, pts: 0 }, { name: 'Tunisia', p: 0, gd: 0, pts: 0 }, { name: 'Sweden', p: 0, gd: 0, pts: 0 } ] },
        G: { name: 'Group G', teams: [ { name: 'Belgium', p: 0, gd: 0, pts: 0 }, { name: 'Iran', p: 0, gd: 0, pts: 0 }, { name: 'Egypt', p: 0, gd: 0, pts: 0 }, { name: 'New Zealand', p: 0, gd: 0, pts: 0 } ] },
        H: { name: 'Group H', teams: [ { name: 'Spain', p: 0, gd: 0, pts: 0 }, { name: 'Uruguay', p: 0, gd: 0, pts: 0 }, { name: 'Saudi Arabia', p: 0, gd: 0, pts: 0 }, { name: 'Cape Verde', p: 0, gd: 0, pts: 0 } ] },
        I: { name: 'Group I', teams: [ { name: 'France', p: 0, gd: 0, pts: 0 }, { name: 'Senegal', p: 0, gd: 0, pts: 0 }, { name: 'Norway', p: 0, gd: 0, pts: 0 }, { name: 'Iraq', p: 0, gd: 0, pts: 0 } ] },
        J: { name: 'Group J', teams: [ { name: 'Argentina', p: 0, gd: 0, pts: 0 }, { name: 'Austria', p: 0, gd: 0, pts: 0 }, { name: 'Algeria', p: 0, gd: 0, pts: 0 }, { name: 'Jordan', p: 0, gd: 0, pts: 0 } ] },
        K: { name: 'Group K', teams: [ { name: 'Portugal', p: 0, gd: 0, pts: 0 }, { name: 'Colombia', p: 0, gd: 0, pts: 0 }, { name: 'Uzbekistan', p: 0, gd: 0, pts: 0 }, { name: 'DR Congo', p: 0, gd: 0, pts: 0 } ] },
        L: { name: 'Group L', teams: [ { name: 'England', p: 0, gd: 0, pts: 0 }, { name: 'Croatia', p: 0, gd: 0, pts: 0 }, { name: 'Panama', p: 0, gd: 0, pts: 0 }, { name: 'Ghana', p: 0, gd: 0, pts: 0 } ] }
      };

      const WC_PLAYERS = [
        // Algeria
        { name: 'Benbot', team: 'Algeria', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'USM Alger', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mastil', team: 'Algeria', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Stade Nyonnais', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Zidane', team: 'Algeria', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Granada CF', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 28, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Abada', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'USM Alger', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ait-nouri', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Belaid', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'JS Kabylie', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Belghali', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'Hellas Verona FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bensebaini', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hadjam', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'BSC Young Boys', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mandi', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tougai', team: 'Algeria', pos: 'Defender', subPos: 'Centre-Back', club: 'Espérance De Tunisie', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Aouar', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ittihad', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bentaleb', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Boudaoui', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'OGC Nice', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Chaibi', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Maza', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bayer 04 Leverkusen', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Titraoui', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sporting Charleroi', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Zerrouki', team: 'Algeria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Twente', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Amoura', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'VfL Wolfsburg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Benbouali', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'Györi ETO FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Boulbina', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ghedjemis', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'Frosinone', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gouiri', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'Olympique Marseille', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hadj Moussa', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'Feyenoord Rotterdam', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mahrez', team: 'Algeria', pos: 'Forward', subPos: 'Striker', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Argentina
        { name: 'Emiliano Martínez', team: 'Argentina', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Aston Villa', formIndicator: '🔥 Big Game', stats: '22 CS, 105 Saves', age: 33, caps: 39, marketValue: 28, popularity: 91, form: 9.2, cleanSheets: 22, saves: 105, savePct: 79 },
        { name: 'Musso', team: 'Argentina', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Rulli', team: 'Argentina', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Olympique Marseille', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 34, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Balerdi', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'Olympique Marseille', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cristian Romero', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'Tottenham', formIndicator: '🔥 Aggressive', stats: '32 Caps, 3 Goals', age: 28, goals: 3, assists: 1, caps: 32, marketValue: 60, popularity: 88, form: 9.2 },
        { name: 'Lisandro Martínez', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester United', formIndicator: '⭐ Stable', stats: '20 Caps, 1 Goal', age: 28, goals: 1, assists: 1, caps: 20, marketValue: 45, popularity: 87, form: 8.7 },
        { name: 'Medina', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'Olympique Marseille', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Montiel', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'CA River Plate', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Otamendi', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 38, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tagliafico', team: 'Argentina', pos: 'Defender', subPos: 'Centre-Back', club: 'Olympique Lyonnais', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alexis Mac Allister', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Liverpool', formIndicator: '📈 Rising', stats: '8 Goals, 10 Assists', age: 27, goals: 8, assists: 10, caps: 25, marketValue: 75, popularity: 87, form: 8.9 },
        { name: 'Barco', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RC Strasbourg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'De Paul', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Inter Miami CF', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Enzo Fernández', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Chelsea', formIndicator: '⭐ Stable', stats: '4 Goals, 8 Assists', age: 25, goals: 4, assists: 8, caps: 22, marketValue: 80, popularity: 86, form: 8.1 },
        { name: 'Gonzalez', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lo Celso', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Betis', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Palacios', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bayer 04 Leverkusen', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Paredes', team: 'Argentina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CA Boca Juniors', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alejandro Garnacho', team: 'Argentina', pos: 'Forward', subPos: 'Winger', club: 'Manchester United', formIndicator: '📈 Young Star', stats: '7 Goals, 5 Assists', age: 21, goals: 7, assists: 5, caps: 5, marketValue: 45, popularity: 89, form: 8.4 },
        { name: 'Almada', team: 'Argentina', pos: 'Forward', subPos: 'Striker', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Julián Álvarez', team: 'Argentina', pos: 'Forward', subPos: 'Striker', club: 'Atletico Madrid', formIndicator: '⭐ Stable', stats: '10 Goals, 12 Assists', age: 26, goals: 10, assists: 12, caps: 31, marketValue: 90, popularity: 88, form: 8.5 },
        { name: 'Lautaro Martínez', team: 'Argentina', pos: 'Forward', subPos: 'Striker', club: 'Inter Milan', formIndicator: '🔥 In Form', stats: '26 Goals, 8 Assists', age: 28, goals: 26, assists: 8, caps: 56, marketValue: 110, popularity: 90, form: 9 },
        { name: 'Lionel Messi', team: 'Argentina', pos: 'Forward', subPos: 'Forward', club: 'Inter Miami', formIndicator: '🔥 GOAT', stats: '106 Goals, 56 Assists', age: 38, goals: 106, assists: 56, caps: 180, marketValue: 30, popularity: 99, form: 9.6 },
        { name: 'Lopez', team: 'Argentina', pos: 'Forward', subPos: 'Striker', club: 'SE Palmeiras', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Paz', team: 'Argentina', pos: 'Forward', subPos: 'Striker', club: 'Como', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Simeone', team: 'Argentina', pos: 'Forward', subPos: 'Striker', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Australia
        { name: 'Beach', team: 'Australia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Melbourne City FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 22, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Izzo', team: 'Australia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Randers FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ryan', team: 'Australia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Levante UD', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 34, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Behich', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Melbourne City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bos', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Feyenoord Rotterdam', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Burgess', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Swansea City AFC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Circati', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Parma', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Degenek', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'APOEL FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Geria', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Albirex Niigata', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Herrington', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Colorado Rapids', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 18, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Italiano', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Grazer AK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Souttar', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'Leicester City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Trewin', team: 'Australia', pos: 'Defender', subPos: 'Centre-Back', club: 'New York City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Devlin', team: 'Australia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Heart Of Midlothian FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Irvine', team: 'Australia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC St. Pauli', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Metcalfe', team: 'Australia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC St. Pauli', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Okon-engstler', team: 'Australia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sydney FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Oneill', team: 'Australia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'New York City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hrustic', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'SC Heracles Almelo', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Irankunda', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'Watford FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Leckie', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'Melbourne City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mabil', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'CD Castellón', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Toure', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'Norwich City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Velupillay', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'Melbourne Victory FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Volpato', team: 'Australia', pos: 'Forward', subPos: 'Striker', club: 'US Sassuolo', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        // Austria
        { name: 'Pentz', team: 'Austria', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Brøndby IF', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Schlager', team: 'Austria', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Red Bull Salzburg', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Wiegele', team: 'Austria', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Viktoria Plze ň', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 25, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Affengruber', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: 'Elche CF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alaba', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: 'Real Madrid C. F.', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Danso', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: 'Tottenham Hotspur FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Friedl', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: 'SV Werder Bremen', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lienhart', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: 'SC Freiburg', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mwene', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: '1. FSV Mainz 05', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Posch', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: '1. FSV Mainz 05', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Svoboda', team: 'Austria', pos: 'Defender', subPos: 'Centre-Back', club: 'Venezia FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Baumgartner', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RB Leipzig', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Chukwuemeka', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Grillitsch', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SC Braga', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Laimer', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Bayern München', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Prass', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sabitzer', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Schmid', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SV Werder Bremen', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Seiwald', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RB Leipzig', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Wanner', team: 'Austria', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Arnautovic', team: 'Austria', pos: 'Forward', subPos: 'Striker', club: 'FK Crvena Zvezda', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 37, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gregoritsch', team: 'Austria', pos: 'Forward', subPos: 'Striker', club: 'FC Augsburg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kalajdzic', team: 'Austria', pos: 'Forward', subPos: 'Striker', club: 'LASK Linz', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Wimmer', team: 'Austria', pos: 'Forward', subPos: 'Striker', club: 'VfL Wolfsburg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Belgium
        { name: 'Lammens', team: 'Belgium', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Manchester United FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Penders', team: 'Belgium', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'RC Strasbourg', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 20, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Thibaut Courtois', team: 'Belgium', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Real Madrid', formIndicator: '🔥 World Class', stats: '15 CS, 65 Saves', age: 34, caps: 102, marketValue: 28, popularity: 90, form: 9.1, cleanSheets: 15, saves: 65, savePct: 83 },
        { name: 'Castagne', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Fulham FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'De Cuyper', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'De Winter', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'AC Milan', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Debast', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Sporting CP', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Mechele', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Club Brugge', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Meunier', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ngoy', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Seys', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Club Brugge', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Theate', team: 'Belgium', pos: 'Defender', subPos: 'Centre-Back', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kevin De Bruyne', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester City', formIndicator: '⭐ Maestro', stats: '26 Goals, 49 Assists', age: 34, goals: 26, assists: 49, caps: 99, marketValue: 60, popularity: 95, form: 9 },
        { name: 'Moreira', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RC Strasbourg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Onana', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Raskin', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Rangers FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Saelemaekers', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AC Milan', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tielemans', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Vanaken', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Club Brugge', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Witsel', team: 'Belgium', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Girona FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 37, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'De Ketelaere', team: 'Belgium', pos: 'Forward', subPos: 'Striker', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Jeremy Doku', team: 'Belgium', pos: 'Forward', subPos: 'Winger', club: 'Manchester City', formIndicator: '📈 Dribbler', stats: '6 Goals, 10 Assists', age: 24, goals: 6, assists: 10, caps: 22, marketValue: 65, popularity: 87, form: 8.5 },
        { name: 'Lukaku', team: 'Belgium', pos: 'Forward', subPos: 'Striker', club: 'SSC Napoli', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Lukebakio', team: 'Belgium', pos: 'Forward', subPos: 'Striker', club: 'SL Ben ca', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Trossard', team: 'Belgium', pos: 'Forward', subPos: 'Striker', club: 'Arsenal FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Bosnia and Herzegovina
        { name: 'Jurkas', team: 'Bosnia and Herzegovina', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FK Borac Banja Luka', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 18, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Vasilj', team: 'Bosnia and Herzegovina', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC St. Pauli', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Zlomislic', team: 'Bosnia and Herzegovina', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'HNK Rijeka', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Celik', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'RC Lens', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 19, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Dedic', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hadzikadunic', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'UC Sampdoria', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Katic', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Schalke 04', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kolasinac', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Muharemovic', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'US Sassuolo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mujakic', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'Gaziantep FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Radeljic', team: 'Bosnia and Herzegovina', pos: 'Defender', subPos: 'Centre-Back', club: 'HNK Rijeka', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Basic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Astana', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Burnic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Karlsruher SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gigovic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'BSC Young Boys', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hadziahmetovic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Hull City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Memic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Viktoria Plze ň', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sunjic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pafos FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tahirovic', team: 'Bosnia and Herzegovina', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Brøndby IF', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alajbegovic', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'FC Red Bull Salzburg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 18, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Bajraktarevic', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Bazdar', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'Jagiellonia Bia ł ystok', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Demirovic', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Dzeko', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'FC Schalke 04', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 40, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Lukic', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'Universitatea Cluj', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Tabakovic', team: 'Bosnia and Herzegovina', pos: 'Forward', subPos: 'Striker', club: 'Borussia Mönchengladbach', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Brazil
        { name: 'Alisson Becker', team: 'Brazil', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Liverpool', formIndicator: '🔥 Elite', stats: '20 CS, 88 Saves', age: 33, caps: 63, marketValue: 32, popularity: 88, form: 8.9, cleanSheets: 20, saves: 88, savePct: 82 },
        { name: 'Ederson', team: 'Brazil', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Weverton', team: 'Brazil', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Grêmio FBPA', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 38, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Alex', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'CR Flamengo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bremer', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'Juventus FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Danilo', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'CR Flamengo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Douglas Santos', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Zenit St. Petersburg', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gabriel Magalhaes', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Leo', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'CR Flamengo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Marquinhos', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'PSG', formIndicator: '⭐ Veteran', stats: '84 Caps, 2 Assists', age: 32, goals: 0, assists: 2, caps: 84, marketValue: 50, popularity: 86, form: 8.6 },
        { name: 'Roger', team: 'Brazil', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bruno Guimarães', team: 'Brazil', pos: 'Midfielder', subPos: 'Defensive Midfielder', club: 'Newcastle', formIndicator: '⭐ Stable', stats: '7 Goals, 10 Assists', age: 28, goals: 7, assists: 10, caps: 20, marketValue: 85, popularity: 84, form: 8.5 },
        { name: 'Casemiro', team: 'Brazil', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 34, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Danilo Santos', team: 'Brazil', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Botafogo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Fabinho', team: 'Brazil', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ittihad', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lucas Paqueta', team: 'Brazil', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CR Flamengo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Endrick', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'Real Madrid', formIndicator: '📈 Wonderkid', stats: '3 Goals, 1 Assist', age: 19, goals: 3, assists: 1, caps: 4, marketValue: 60, popularity: 91, form: 8.8 },
        { name: 'Esley', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'AS Roma', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Gabriel', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'Arsenal FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Igor Thiago', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'Brentford FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Luiz', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'FC Zenit St. Petersburg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Matheus Cunha', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'Manchester United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Neymar Jr', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'Santos FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Raphinha', team: 'Brazil', pos: 'Forward', subPos: 'Striker', club: 'FC Barcelona', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Rodrygo', team: 'Brazil', pos: 'Forward', subPos: 'Winger', club: 'Real Madrid', formIndicator: '⭐ Stable', stats: '17 Goals, 9 Assists', age: 25, goals: 17, assists: 9, caps: 22, marketValue: 110, popularity: 89, form: 8.6 },
        { name: 'Vinicius Jr', team: 'Brazil', pos: 'Forward', subPos: 'Winger', club: 'Real Madrid', formIndicator: '🔥 Elite', stats: '24 Goals, 11 Assists', age: 25, goals: 24, assists: 11, caps: 30, marketValue: 180, popularity: 96, form: 9.5 },
        // Cameroon
        { name: 'André Onana', team: 'Cameroon', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Manchester United', formIndicator: '⭐ Active', stats: '11 CS, 142 Saves', age: 30, caps: 40, marketValue: 35, popularity: 86, form: 8.4, cleanSheets: 11, saves: 142, savePct: 75 },
        // Canada
        { name: 'Crepeau', team: 'Canada', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Orlando City SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Goodman', team: 'Canada', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Barnsley', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 22, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'St. Clair', team: 'Canada', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Inter Miami CF', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Alphonso Davies', team: 'Canada', pos: 'Defender', subPos: 'Full-Back', club: 'Bayern Munich', formIndicator: '⭐ Stable', stats: '15 Goals, 18 Assists', age: 25, goals: 15, assists: 18, caps: 47, marketValue: 50, popularity: 89, form: 8.7 },
        { name: 'Bombito', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'OGC Nice', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cornelius', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'Rangers FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'De Fougerolles', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'FCV Dender EH', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 20, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Johnston', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jones', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'Middlesbrough FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Laryea', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'Toronto FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sigur', team: 'Canada', pos: 'Defender', subPos: 'Centre-Back', club: 'HNK Hajduk Split', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Choiniere', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'LAFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Eustaquio', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'LAFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kone', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'US Sassuolo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Millar', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Hull City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Osorio', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Toronto FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 34, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Saliba', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RSC Anderlecht', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Shaffelburg', team: 'Canada', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'LAFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ahmed', team: 'Canada', pos: 'Forward', subPos: 'Striker', club: 'Norwich City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Aterman', team: 'Canada', pos: 'Forward', subPos: 'Striker', club: 'Chicago Fire FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Buchanan', team: 'Canada', pos: 'Forward', subPos: 'Striker', club: 'Villarreal CF', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Jonathan David', team: 'Canada', pos: 'Forward', subPos: 'Striker', club: 'Lille', formIndicator: '📈 In Form', stats: '26 Goals, 8 Assists', age: 26, goals: 26, assists: 8, caps: 48, marketValue: 50, popularity: 83, form: 8.9 },
        { name: 'Larin', team: 'Canada', pos: 'Forward', subPos: 'Striker', club: 'Southampton FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Oluwaseyi', team: 'Canada', pos: 'Forward', subPos: 'Striker', club: 'Villarreal CF', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Cape Verde
        { name: 'Cj Dos Santos', team: 'Cape Verde', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'San Diego FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 25, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Marcio', team: 'Cape Verde', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'PFC Montana', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Vozinha', team: 'Cape Verde', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'GD Chaves', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 40, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Diney', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Bataeh Club', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kelvin Pires', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'SJK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Logan Costa', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'Villarreal CF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Pico Lopes', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'Shamrock Rovers FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sidny Lopes', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Steven', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'Columbus Crew', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Stopira', team: 'Cape Verde', pos: 'Defender', subPos: 'Centre-Back', club: 'SCU Torreense', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 38, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Deroy Duarte', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PFC Ludogorets Razgrad', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Garry', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Apollon Limassol', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jamiro Monteiro', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PEC Zwolle', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Joao Paulo', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC FCSB', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jovane', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CF Estrela Da Amadora', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kevin Pina', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Krasnodar', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Laros Duarte', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Puskás Akadémia FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nuno Da Costa', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Ba ş ak ş ehir FK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Telmo', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Vitória SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Willy Semedo', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AC Omonia', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yannick', team: 'Cape Verde', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SC Farense', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Agner Pina', team: 'Cape Verde', pos: 'Forward', subPos: 'Striker', club: 'Trabzonspor', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Dailon Livramento', team: 'Cape Verde', pos: 'Forward', subPos: 'Striker', club: 'Casa Pia AC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gilson', team: 'Cape Verde', pos: 'Forward', subPos: 'Striker', club: 'FC Akron Tolyatti', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ryan Mendes', team: 'Cape Verde', pos: 'Forward', subPos: 'Striker', club: 'I ğ dır FK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 36, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Colombia
        { name: 'Montero', team: 'Colombia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'CA Vélez Sars eld', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ospina', team: 'Colombia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Atlético Nacional', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 37, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Vargas', team: 'Colombia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Atlas FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 37, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Arias', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'CA Independiente', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ditta', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'CF Cruz Azul', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lucumi', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'Bologna FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Machado', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Nantes', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mina', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'Cagliari', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mojica', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'RCD Mallorca', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Munoz', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Puerta', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'Racing Santander', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Sanchez', team: 'Colombia', pos: 'Defender', subPos: 'Centre-Back', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Carrascal', team: 'Colombia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CR Flamengo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Castano', team: 'Colombia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CA River Plate', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'James Rodríguez', team: 'Colombia', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Rayo Vallecano', formIndicator: '🔥 Copa MVP', stats: '28 Goals, 32 Assists', age: 34, goals: 28, assists: 32, caps: 100, marketValue: 5, popularity: 86, form: 9.2 },
        { name: 'Lerma', team: 'Colombia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Portilla', team: 'Colombia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Athletico Paranaense', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Quintero', team: 'Colombia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CA River Plate', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rios', team: 'Colombia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Campaz', team: 'Colombia', pos: 'Forward', subPos: 'Striker', club: 'CA Rosario Central', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Cordoba', team: 'Colombia', pos: 'Forward', subPos: 'Striker', club: 'FC Krasnodar', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hernandez', team: 'Colombia', pos: 'Forward', subPos: 'Striker', club: 'Real Betis', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Luis Díaz', team: 'Colombia', pos: 'Forward', subPos: 'Winger', club: 'Liverpool', formIndicator: '🔥 Dynamic', stats: '12 Goals, 5 Assists', age: 29, goals: 12, assists: 5, caps: 47, marketValue: 75, popularity: 89, form: 9 },
        { name: 'Suarez', team: 'Colombia', pos: 'Forward', subPos: 'Striker', club: 'Sporting CP', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Croatia
        { name: 'Kotarski', team: 'Croatia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC København', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Livakovic', team: 'Croatia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'GNK Dinamo Zagreb', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Pandur', team: 'Croatia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Hull City FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Caleta-car', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'Real Sociedad', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Erlic', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Midtjylland', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jakic', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Augsburg', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Joško Gvardiol', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City', formIndicator: '🔥 Strong', stats: '30 Caps, 5 Goals', age: 24, goals: 5, assists: 3, caps: 30, marketValue: 75, popularity: 89, form: 9.1 },
        { name: 'Pongracic', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'ACF Fiorentina', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Stanisic', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Bayern München', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sutalo', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'AFC Ajax', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Vuskovic', team: 'Croatia', pos: 'Defender', subPos: 'Centre-Back', club: 'Hamburger SV', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 19, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Baturina', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Como', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Fruk', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'HNK Rijeka', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kovacic', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Luka Modric', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Madrid', formIndicator: '⭐ Timeless', stats: '24 Goals, 29 Assists', age: 40, goals: 24, assists: 29, caps: 174, marketValue: 6, popularity: 94, form: 8.8 },
        { name: 'Moro', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bologna FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Pasalic', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sucic', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Internazionale Milano', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Vlasic', team: 'Croatia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Torino FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Budimir', team: 'Croatia', pos: 'Forward', subPos: 'Striker', club: 'CA Osasuna', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kramaric', team: 'Croatia', pos: 'Forward', subPos: 'Striker', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Matanovic', team: 'Croatia', pos: 'Forward', subPos: 'Striker', club: 'SC Freiburg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Perisic', team: 'Croatia', pos: 'Forward', subPos: 'Striker', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 37, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Curaçao
        { name: 'Bodak', team: 'Curaçao', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'SC Telstar', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 24, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Room', team: 'Curaçao', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Miami FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 37, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Bazoer', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'Konyaspor', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Brenet', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'Kayserispor', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Floranus', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'PEC Zwolle', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Fonville', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'NEC Nijmegen', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gaari', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'Abha Club', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Obispo', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sambo', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'Sparta Rotterdam', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Van Eijma', team: 'Curaçao', pos: 'Defender', subPos: 'Centre-Back', club: 'RKC Waalwijk', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bacuna', team: 'Curaçao', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Volendam', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Chong', team: 'Curaçao', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'She eld United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Comenencia', team: 'Curaçao', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Zürich', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Felida', team: 'Curaçao', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Den Bosch', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Martha', team: 'Curaçao', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Rotherham United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Roemeratoe', team: 'Curaçao', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RKC Waalwijk', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Antonisse', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'AE Ki sia FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gorre', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'Maccabi Haifa FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hansen', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'Middlesbrough FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kastaneer', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'Terengganu FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kuwas', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'FC Volendam', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Locadia', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'Miami FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Margaritha', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'SK Beveren', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Noslin', team: 'Curaçao', pos: 'Forward', subPos: 'Striker', club: 'SC Telstar', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Czechia
        { name: 'Hornicek', team: 'Czechia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'SC Braga', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Kovar', team: 'Czechia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Stanek', team: 'Czechia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Chaloupek', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Coufal', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Doudera', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Holes', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hranac', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jurasek', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Krejci', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'Wolverhampton Wanderers FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zeleny', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'AC Sparta Praha', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zima', team: 'Czechia', pos: 'Defender', subPos: 'Centre-Back', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cerv', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Viktoria Plze ň', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Darida', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Hradec Králové', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Provod', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sadilek', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sochurek', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AC Sparta Praha', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 18, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Sojka', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Viktoria Plze ň', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Soucek', team: 'Czechia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'West Ham United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Chory', team: 'Czechia', pos: 'Forward', subPos: 'Striker', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Chytil', team: 'Czechia', pos: 'Forward', subPos: 'Striker', club: 'SK Slavia Praha', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hlozek', team: 'Czechia', pos: 'Forward', subPos: 'Striker', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kuchta', team: 'Czechia', pos: 'Forward', subPos: 'Striker', club: 'AC Sparta Praha', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Schick', team: 'Czechia', pos: 'Forward', subPos: 'Striker', club: 'Bayer 04 Leverkusen', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Sulc', team: 'Czechia', pos: 'Forward', subPos: 'Striker', club: 'Olympique Lyonnais', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // DR Congo
        { name: 'Epolo', team: 'DR Congo', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Standard Liège', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 21, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Fayulu', team: 'DR Congo', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Noah', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mpasi', team: 'DR Congo', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Le Havre AC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Batubinsika', team: 'DR Congo', pos: 'Defender', subPos: 'Centre-Back', club: 'AEL FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kalulu', team: 'DR Congo', pos: 'Defender', subPos: 'Centre-Back', club: 'Aris Limassol FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kapuadi', team: 'DR Congo', pos: 'Defender', subPos: 'Centre-Back', club: 'Widzew Ł ód ź', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kayembe', team: 'DR Congo', pos: 'Defender', subPos: 'Centre-Back', club: 'KRC Genk', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mbemba', team: 'DR Congo', pos: 'Defender', subPos: 'Centre-Back', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tuanzebe', team: 'DR Congo', pos: 'Defender', subPos: 'Centre-Back', club: 'Burnley FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bongonda', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Spartak Moscow', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mbuku', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Montpellier HSC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Moutoussamy', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atromitos FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mukau', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Pickel', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RCD Espanyol', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sadiki', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Tshibola', team: 'DR Congo', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Kilmarnock FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'An-bissaka', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'West Ham United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Bakambu', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'Real Betis', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Banza', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'Al Jazira', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Cipenga', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'CD Castellón', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Elia', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'Alanyaspor', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kakuta', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'AEL FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mayele', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'Pyramids FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Wissa', team: 'DR Congo', pos: 'Forward', subPos: 'Striker', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Ecuador
        { name: 'Galindez', team: 'Ecuador', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'CA Huracán', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 39, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ramirez', team: 'Ecuador', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'AE Ki sia FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 25, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Valle', team: 'Ecuador', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'LDU Quito', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Estupinan', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'AC Milan', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hincapie', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ordonez', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'Club Brugge', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Pacho', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Porozo', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'Club Tijuana', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Preciado', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'Atlético Mineiro', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Torres', team: 'Ecuador', pos: 'Defender', subPos: 'Centre-Back', club: 'SC Internacional', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alcivar', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Independiente Del Valle', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Castillo', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Midtjylland', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Franco', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlético Mineiro', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Minda', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlético Mineiro', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Paez', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CA River Plate', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 19, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Valencia', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Royal Antwerp FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Vite', team: 'Ecuador', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pumas UNAM', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Angulo', team: 'Ecuador', pos: 'Forward', subPos: 'Striker', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Arevalo', team: 'Ecuador', pos: 'Forward', subPos: 'Striker', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Caicedo', team: 'Ecuador', pos: 'Forward', subPos: 'Striker', club: 'CA Huracán', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Plata', team: 'Ecuador', pos: 'Forward', subPos: 'Striker', club: 'CR Flamengo', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Rodriguez', team: 'Ecuador', pos: 'Forward', subPos: 'Striker', club: 'Royale Union Saint-Gilloise', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Yeboah', team: 'Ecuador', pos: 'Forward', subPos: 'Striker', club: 'Venezia FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Egypt
        { name: 'Mahdy Soliman', team: 'Egypt', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Zamalek SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 39, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mohamed Elshenawy', team: 'Egypt', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 37, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mostafa Shoubir', team: 'Egypt', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ahmed Fatouh', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'Zamalek SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hossam Abdelmaguid', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'Zamalek SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Karim Hafez', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'Pyramids FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohamed Hany', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ramy Rabia', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ain FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tarek Alaa', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'ZED FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yasser', team: 'Egypt', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Emam Ashour', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hamdy Fathy', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Wakrah SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mahmoud', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'ZED FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Marawan Attia', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohanad Lashin', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pyramids FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mostafa Zico', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pyramids FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nabil Donga', team: 'Egypt', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Najmah SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Haissem Hassan', team: 'Egypt', pos: 'Forward', subPos: 'Striker', club: 'Real Oviedo', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hamza', team: 'Egypt', pos: 'Forward', subPos: 'Striker', club: 'FC Barcelona', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 18, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Ibrahim', team: 'Egypt', pos: 'Forward', subPos: 'Striker', club: 'FC Nordsjælland', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mohamed Salah', team: 'Egypt', pos: 'Forward', subPos: 'Winger', club: 'Liverpool', formIndicator: '🔥 Egyptian King', stats: '56 Goals, 31 Assists', age: 33, goals: 56, assists: 31, caps: 98, marketValue: 55, popularity: 95, form: 9.3 },
        { name: 'Omar Marmoush', team: 'Egypt', pos: 'Forward', subPos: 'Striker', club: 'Manchester City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Trezeguet', team: 'Egypt', pos: 'Forward', subPos: 'Striker', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Zizo', team: 'Egypt', pos: 'Forward', subPos: 'Striker', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // England
        { name: 'Henderson', team: 'England', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Jordan Pickford', team: 'England', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Everton', formIndicator: '⭐ Solid', stats: '15 CS, 121 Saves', age: 32, caps: 60, marketValue: 22, popularity: 80, form: 8.3, cleanSheets: 15, saves: 121, savePct: 76 },
        { name: 'Trafford', team: 'England', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Manchester City FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Burn', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Guehi', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'James', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Chelsea FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'John Stones', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City', formIndicator: '⭐ Solid', stats: '72 Caps, 1 Goal', age: 32, goals: 1, assists: 1, caps: 72, marketValue: 38, popularity: 85, form: 8.5 },
        { name: 'Konsa', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lewis Hall', team: 'England', pos: 'Defender', subPos: 'Full-Back', club: 'Newcastle', formIndicator: '⭐ Active', stats: '1 Cap, 1 Goal', age: 21, goals: 1, assists: 3, caps: 1, marketValue: 25, popularity: 78, form: 8.1 },
        { name: 'Livramento', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Oreilly', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Rico Lewis', team: 'England', pos: 'Defender', subPos: 'Full-Back', club: 'Manchester City', formIndicator: '⭐ Versatile', stats: '4 Caps, 2 Goals', age: 21, goals: 2, assists: 4, caps: 4, marketValue: 38, popularity: 81, form: 8.5 },
        { name: 'Spence', team: 'England', pos: 'Defender', subPos: 'Centre-Back', club: 'Tottenham Hotspur FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Anderson', team: 'England', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Nottingham Forest FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Declan Rice', team: 'England', pos: 'Midfielder', subPos: 'Defensive Midfielder', club: 'Arsenal', formIndicator: '🔥 Engine', stats: '5 Goals, 9 Assists', age: 27, goals: 5, assists: 9, caps: 50, marketValue: 120, popularity: 89, form: 9 },
        { name: 'Eze', team: 'England', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jude Bellingham', team: 'England', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Real Madrid', formIndicator: '🔥 Golden Boy', stats: '25 Goals, 16 Assists', age: 22, goals: 25, assists: 16, caps: 29, marketValue: 180, popularity: 97, form: 9.6 },
        { name: 'Kobbie Mainoo', team: 'England', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester United', formIndicator: '📈 Young Star', stats: '3 Goals, 2 Assists', age: 21, goals: 3, assists: 2, caps: 8, marketValue: 50, popularity: 88, form: 8.7 },
        { name: 'Rogers', team: 'England', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bukayo Saka', team: 'England', pos: 'Forward', subPos: 'Winger', club: 'Arsenal', formIndicator: '🔥 Spark', stats: '15 Goals, 17 Assists', age: 24, goals: 15, assists: 17, caps: 32, marketValue: 130, popularity: 93, form: 9.2 },
        { name: 'Cole Palmer', team: 'England', pos: 'Forward', subPos: 'Attacking Midfielder', club: 'Chelsea', formIndicator: '🔥 Ice Cold', stats: '27 Goals, 15 Assists', age: 24, goals: 27, assists: 15, caps: 4, marketValue: 90, popularity: 94, form: 9.7 },
        { name: 'Gordon', team: 'England', pos: 'Forward', subPos: 'Striker', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Harry Kane', team: 'England', pos: 'Forward', subPos: 'Striker', club: 'Bayern Munich', formIndicator: '🔥 Lethal', stats: '62 Goals, 22 Assists', age: 32, goals: 62, assists: 22, caps: 89, marketValue: 110, popularity: 92, form: 9.1 },
        { name: 'Madueke', team: 'England', pos: 'Forward', subPos: 'Striker', club: 'Arsenal FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Phil Foden', team: 'England', pos: 'Forward', subPos: 'Winger', club: 'Manchester City', formIndicator: '⭐ Stable', stats: '19 Goals, 14 Assists', age: 26, goals: 19, assists: 14, caps: 34, marketValue: 150, popularity: 91, form: 8.9 },
        { name: 'Rashford', team: 'England', pos: 'Forward', subPos: 'Striker', club: 'FC Barcelona', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Toney', team: 'England', pos: 'Forward', subPos: 'Striker', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Watkins', team: 'England', pos: 'Forward', subPos: 'Striker', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // France
        { name: 'Mike Maignan', team: 'France', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'AC Milan', formIndicator: '📈 Rising', stats: '18 CS, 98 Saves', age: 30, caps: 16, marketValue: 38, popularity: 82, form: 8.7, cleanSheets: 18, saves: 98, savePct: 81 },
        { name: 'Risser', team: 'France', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'RC Lens', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 21, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Samba', team: 'France', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Stade Rennais FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Digne', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gusto', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'Chelsea FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hernandez', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ibrahima Konaté', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'Liverpool', formIndicator: '⭐ Solid', stats: '14 Caps, 1 Goal', age: 27, goals: 1, assists: 0, caps: 14, marketValue: 45, popularity: 82, form: 8.6 },
        { name: 'Kounde', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Barcelona', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Upamecano', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Bayern München', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'William Saliba', team: 'France', pos: 'Defender', subPos: 'Centre-Back', club: 'Arsenal', formIndicator: '🔥 Elite', stats: '15 Caps, 10 CS', age: 25, goals: 2, assists: 1, caps: 15, marketValue: 80, popularity: 89, form: 9.3 },
        { name: 'Akliouche', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AS Monaco', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cherki', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Kante', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kone', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AS Roma', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rabiot', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AC Milan', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tchouameni', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Madrid C. F.', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Warren Zaïre-Emery', team: 'France', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PSG', formIndicator: '📈 Rising', stats: '4 Goals, 7 Assists', age: 20, goals: 4, assists: 7, caps: 3, marketValue: 60, popularity: 84, form: 8.8 },
        { name: 'Antoine Griezmann', team: 'France', pos: 'Forward', subPos: 'Attacking Midfielder', club: 'Atletico Madrid', formIndicator: '⭐ Stable', stats: '44 Goals, 38 Assists', age: 35, goals: 44, assists: 38, caps: 129, marketValue: 25, popularity: 88, form: 8.2 },
        { name: 'Barcola', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Dembele', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Doue', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Kylian Mbappé', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'Real Madrid', formIndicator: '🔥 In Form', stats: '48 Goals, 18 Assists', age: 27, goals: 48, assists: 18, caps: 79, marketValue: 180, popularity: 98, form: 9.5 },
        { name: 'Mateta', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mathys Tel', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'Bayern Munich', formIndicator: '⭐ Promising', stats: '9 Goals, 4 Assists', age: 21, goals: 9, assists: 4, caps: 2, marketValue: 40, popularity: 82, form: 8 },
        { name: 'Olise', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'FC Bayern München', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Thuram', team: 'France', pos: 'Forward', subPos: 'Striker', club: 'FC Internazionale Milano', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Germany
        { name: 'Baumann', team: 'Germany', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 36, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Marc-André ter Stegen', team: 'Germany', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Barcelona', formIndicator: '⭐ Stable', stats: '14 CS, 82 Saves', age: 34, caps: 40, marketValue: 28, popularity: 83, form: 8.2, cleanSheets: 14, saves: 82, savePct: 75 },
        { name: 'Neuer', team: 'Germany', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Bayern München', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 40, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Nuebel', team: 'Germany', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Antonio Rüdiger', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'Real Madrid', formIndicator: '🔥 Wall', stats: '68 Caps, 3 Goals', age: 33, goals: 3, assists: 1, caps: 68, marketValue: 25, popularity: 89, form: 9.1 },
        { name: 'Brown', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Raum', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'RB Leipzig', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ruediger', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'Real Madrid C. F.', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Schlotterbeck', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tah', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Bayern München', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Thiaw', team: 'Germany', pos: 'Defender', subPos: 'Centre-Back', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Aleksandar Pavlovic', team: 'Germany', pos: 'Midfielder', subPos: 'Defensive Midfielder', club: 'Bayern Munich', formIndicator: '⭐ Steady', stats: '2 Goals, 3 Assists', age: 22, goals: 2, assists: 3, caps: 2, marketValue: 30, popularity: 80, form: 8.2 },
        { name: 'Amiri', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: '1. FSV Mainz 05', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Florian Wirtz', team: 'Germany', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Leverkusen', formIndicator: '🔥 Elite', stats: '18 Goals, 20 Assists', age: 23, goals: 18, assists: 20, caps: 18, marketValue: 130, popularity: 93, form: 9.6 },
        { name: 'Goretzka', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Bayern München', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gross', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jamal Musiala', team: 'Germany', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Bayern Munich', formIndicator: '🔥 Magic', stats: '12 Goals, 8 Assists', age: 23, goals: 12, assists: 8, caps: 25, marketValue: 110, popularity: 94, form: 9.4 },
        { name: 'Joshua Kimmich', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bayern Munich', formIndicator: '⭐ Stable', stats: '2 Goals, 10 Assists', age: 31, goals: 2, assists: 10, caps: 86, marketValue: 50, popularity: 86, form: 8.3 },
        { name: 'Leweling', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nmecha', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ouedraogo', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RB Leipzig', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Sane', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Stiller', team: 'Germany', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Beier', team: 'Germany', pos: 'Forward', subPos: 'Striker', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kai Havertz', team: 'Germany', pos: 'Forward', subPos: 'Striker', club: 'Arsenal', formIndicator: '📈 Form', stats: '14 Goals, 7 Assists', age: 27, goals: 14, assists: 7, caps: 46, marketValue: 70, popularity: 87, form: 8.8 },
        { name: 'Woltemade', team: 'Germany', pos: 'Forward', subPos: 'Striker', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Ghana
        { name: 'Anang', team: 'Ghana', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'St Patrick\'s Athletic FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Asare', team: 'Ghana', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Hearts Of Oak SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Zigi', team: 'Ghana', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC St. Gallen', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Adjetey', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'VfL Wolfsburg', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Luckassen', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'Pafos FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mensah', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'AJ Auxerre', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mumin', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'Rayo Vallecano', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Opoku', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'Ba ş ak ş ehir FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Oppong', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'OGC Nice', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Rahman', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'PAOK Saloniki', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Seidu', team: 'Ghana', pos: 'Defender', subPos: 'Centre-Back', club: 'Stade Rennais FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Boakye', team: 'Ghana', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AS Saint-Etienne', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Owusu', team: 'Ghana', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AJ Auxerre', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Partey', team: 'Ghana', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Villarreal CF', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Semenyo', team: 'Ghana', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sibo', team: 'Ghana', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Oviedo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yirenkyi', team: 'Ghana', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Nordsjælland', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Adu', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'FC Viktoria Plze ň', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Ayew', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Leicester City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Baah', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Al Qadsiah FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Issahaku', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Leicester City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Nuamah', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Olympique Lyonnais', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Sulemana', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Thomas-asante', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Coventry City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Williams', team: 'Ghana', pos: 'Forward', subPos: 'Striker', club: 'Athletic Club', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Haiti
        { name: 'Duverger', team: 'Haiti', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Cosmos Koblenz', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Pierre', team: 'Haiti', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Sochaux-Montbéliard', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 25, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Placide', team: 'Haiti', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'SC Bastia', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 38, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ade', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'LDU Quito', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 36, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Arcus', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'Angers SCO', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Delcroix', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Lugano', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Duverne', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'KAA Gent', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Experience', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'AS Nancy', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lacroix', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'Colorado Springs Switchbacks FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Paugain', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'SV Zulte Waregem', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Thermoncy', team: 'Haiti', pos: 'Defender', subPos: 'Centre-Back', club: 'BSC Young Boys', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 20, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Bellegarde', team: 'Haiti', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Wolverhampton Wanderers FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jean Jacques', team: 'Haiti', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Philadelphia Union', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sainte', team: 'Haiti', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'El Paso Locomotive FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Simon', team: 'Haiti', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Tatran Pre š ov', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Casimir', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'AJ Auxerre', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Deedson', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'FC Dallas', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Etienne', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'Toronto FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Fortune', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'FC Vizela', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Isidor', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Joseph', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'Ferencvárosi TC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Nazon', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'Esteghlal Tehran FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Pierrot', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'Çaykur Rizespor', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Providence', team: 'Haiti', pos: 'Forward', subPos: 'Striker', club: 'Almere City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Iran
        { name: 'Beiranvand', team: 'Iran', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Tractor Sazi Tabriz FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Hosseini', team: 'Iran', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Sepahan SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Niazmand', team: 'Iran', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Persepolis FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Hajisafi', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Sepahan SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 36, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hardani', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Esteghlal Tehran FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Iri', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Malavan Anzali FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Kanani', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Persepolis FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Khalilzadeh', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Tractor Sazi Tabriz FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 37, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohammadi', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Persepolis FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nemati', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Foolad Khuzestan FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rezaeian', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Foolad Khuzestan FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 36, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yousefi', team: 'Iran', pos: 'Defender', subPos: 'Centre-Back', club: 'Sepahan SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cheshmi', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Esteghlal Tehran FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ezatolahi', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Shabab Al Ahli Club', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ghoddos', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ittihad Kalba SCC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ghorbani', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Wahda SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jahanbakhsh', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FCV Dender EH', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohebbi', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Rostov', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Torabi', team: 'Iran', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Tractor Sazi Tabriz FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alipour', team: 'Iran', pos: 'Forward', subPos: 'Striker', club: 'Persepolis FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Dargahi', team: 'Iran', pos: 'Forward', subPos: 'Striker', club: 'Standard Liège', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ghayedi', team: 'Iran', pos: 'Forward', subPos: 'Striker', club: 'Al Nasr SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hosseinzadeh', team: 'Iran', pos: 'Forward', subPos: 'Striker', club: 'Tractor Sazi Tabriz FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Moghanloo', team: 'Iran', pos: 'Forward', subPos: 'Striker', club: 'Al Ittihad Kalba SCC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Taremi', team: 'Iran', pos: 'Forward', subPos: 'Striker', club: 'Olympiacos FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Iraq
        { name: 'Fahad Talib', team: 'Iraq', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Talaba SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Jalal Hassan', team: 'Iraq', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Zawra\'a SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 35, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ahmed Maknazi', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Karma SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Akam Hashim', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Zawra\'a SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hussein', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Pogo ń  Szczecin', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Merchas Doski', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Viktoria Plze ň', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Munaf Younus', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Shorta SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mustafa Saadoon', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Shorta SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rebin Sulaka', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Port FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zaid Tahseen', team: 'Iraq', pos: 'Defender', subPos: 'Centre-Back', club: 'Pakhtakor Tashkent FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Aimar Sher', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sarpsborg 08 FF', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Amir Alammari', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'KS Cracovia', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ibrahim Bayesh', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Dhafra SCC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kevin Yakob', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Aarhus GF', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Youssef Amyn', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AEK Larnaca FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Zaid Ismael', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Talaba SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zidane Iqbal', team: 'Iraq', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Utrecht', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ahmed', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Nashville SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Ali Alhamadi', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Luton Town FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ali Jasim', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Al Najmah SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Ali Yousif', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Al Talaba SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Aymen', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Al Karma SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Marko Farji', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Venezia FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Mohanad Ali', team: 'Iraq', pos: 'Forward', subPos: 'Striker', club: 'Dibba FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Italy
        { name: 'Gianluigi Donnarumma', team: 'Italy', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'PSG', formIndicator: '⭐ Solid', stats: '16 CS, 112 Saves', age: 27, caps: 62, marketValue: 40, popularity: 87, form: 8.8, cleanSheets: 16, saves: 112, savePct: 79 },
        { name: 'Riccardo Calafiori', team: 'Italy', pos: 'Defender', subPos: 'Centre-Back', club: 'Arsenal', formIndicator: '📈 Rising', stats: '5 Caps, 1 Goal', age: 24, goals: 2, assists: 5, caps: 5, marketValue: 45, popularity: 88, form: 9.1 },
        // Ivory Coast
        { name: 'Fofana', team: 'Ivory Coast', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Çaykur Rizespor', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 25, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Kone', team: 'Ivory Coast', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Sporting Charleroi', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 24, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Lafont', team: 'Ivory Coast', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Panathinaikos FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Agbadou', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'Be ş ikta ş  JK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Diomande', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'Sporting CP', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Doue', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'RC Strasbourg', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Konan', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'Gil Vicente FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kossounou', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ndicka', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'AS Roma', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Operi', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'Ba ş ak ş ehir FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Singo', team: 'Ivory Coast', pos: 'Defender', subPos: 'Centre-Back', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Guiagon', team: 'Ivory Coast', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sporting Charleroi', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kessie', team: 'Ivory Coast', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sangare', team: 'Ivory Coast', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Nottingham Forest FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Seri', team: 'Ivory Coast', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'NK Maribor', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 34, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Adingra', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'AS Monaco', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Bonny', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'FC Internazionale Milano', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Diakite', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'Cercle Brugge', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Diallo', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'Manchester United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Guessand', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Pepe', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'Villarreal CF', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Toure', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Wahi', team: 'Ivory Coast', pos: 'Forward', subPos: 'Striker', club: 'OGC Nice', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Japan
        { name: 'Hayakawa', team: 'Japan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Kashima Antlers', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Osako', team: 'Japan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Sanfrecce Hiroshima', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Itakura', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'AFC Ajax', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nagatomo', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Tokyo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 39, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Seko', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'Le Havre AC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sugawara', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'SV Werder Bremen', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Suzuki', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'FC København', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Taniguchi', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'Sint-Truiden VV', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tomiyasu', team: 'Japan', pos: 'Defender', subPos: 'Centre-Back', club: 'AFC Ajax', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Doan', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Endo', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Liverpool FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kamada', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Maeda', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nakamura', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Stade Reims', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sano', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: '1. FSV Mainz 05', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tanaka', team: 'Japan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Leeds United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Atanabe', team: 'Japan', pos: 'Forward', subPos: 'Striker', club: 'Feyenoord Rotterdam', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Goto', team: 'Japan', pos: 'Forward', subPos: 'Striker', club: 'Sint-Truiden VV', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Kaoru Mitoma', team: 'Japan', pos: 'Forward', subPos: 'Winger', club: 'Brighton', formIndicator: '⭐ Tricky', stats: '8 Goals, 9 Assists', age: 29, goals: 8, assists: 9, caps: 20, marketValue: 45, popularity: 88, form: 8.6 },
        { name: 'Ogawa', team: 'Japan', pos: 'Forward', subPos: 'Striker', club: 'NEC Nijmegen', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Takefusa Kubo', team: 'Japan', pos: 'Forward', subPos: 'Winger', club: 'Real Sociedad', formIndicator: '⭐ Creative', stats: '7 Goals, 11 Assists', age: 25, goals: 7, assists: 11, caps: 32, marketValue: 50, popularity: 87, form: 8.5 },
        { name: 'Ueda', team: 'Japan', pos: 'Forward', subPos: 'Striker', club: 'Feyenoord Rotterdam', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Jordan
        { name: 'Abdallah Alfakhori', team: 'Jordan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Wahdat SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Nour Baniateyah', team: 'Jordan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Faisaly SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Yazeed Abulaila', team: 'Jordan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Hussein SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Abdallah Nasib', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Zawra\'a SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ehsan Haddad', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hussein SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Husam Abudahab', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Faisaly SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohammad Abualnadi', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Selangor FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohammad Abuhasheesh', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Karma SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Saed Alrosan', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hussein SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Saleem Obaid', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hussein SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yazan Alarab', team: 'Jordan', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Seoul', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Amer Jamous', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Zawra\'a SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ibrahim Sadeh', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Karma SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohammad Aldaoud', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Wahdat SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 34, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohannad Abutaha', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al-Quwa Al-Jawiya', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nizar Alrashdan', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Qatar SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Noor Alrawabdeh', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Selangor FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rajaei Ayed', team: 'Jordan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Hussein SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ali Azaizeh', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'Al Shabab FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Ali Olwan', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'Al Sailiya SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ibrahim Sabra', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'NK Lokomotiva Zagreb', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Mahmoud Almardi', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'Al Hussein SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mohammad', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'Raja Casablanca', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mousa Altamari', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'Stade Rennais FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Odeh Fakhoury', team: 'Jordan', pos: 'Forward', subPos: 'Striker', club: 'Pyramids FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        // Mexico
        { name: 'Acevedo', team: 'Mexico', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Club Santos Laguna', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ochoa', team: 'Mexico', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'AEL Limassol', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 40, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Rangel', team: 'Mexico', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'CD Guadalajara', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Chavez', team: 'Mexico', pos: 'Defender', subPos: 'Centre-Back', club: 'AZ Alkmaar', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Gallardo', team: 'Mexico', pos: 'Defender', subPos: 'Centre-Back', club: 'Deportivo Toluca FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Montes', team: 'Mexico', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Lokomotiv Moscow', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Reyes', team: 'Mexico', pos: 'Defender', subPos: 'Centre-Back', club: 'Club América', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sanchez', team: 'Mexico', pos: 'Defender', subPos: 'Centre-Back', club: 'PAOK Saloniki', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Vasquez', team: 'Mexico', pos: 'Defender', subPos: 'Centre-Back', club: 'Genoa CFC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Edson Álvarez', team: 'Mexico', pos: 'Midfielder', subPos: 'Defensive Midfielder', club: 'West Ham', formIndicator: '⭐ Leader', stats: '5 Goals, 2 Assists', age: 28, goals: 5, assists: 2, caps: 74, marketValue: 35, popularity: 83, form: 8.5 },
        { name: 'Fidalgo', team: 'Mexico', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Betis', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lira', team: 'Mexico', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CF Cruz Azul', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mora', team: 'Mexico', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Club Tijuana', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 17, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Pineda', team: 'Mexico', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AEK Athens', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Romo', team: 'Mexico', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CD Guadalajara', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Vargas', team: 'Mexico', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Alvarado', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'CD Guadalajara', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gonzalez', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'CD Guadalajara', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Huerta', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'RSC Anderlecht', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Jimenez', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'Fulham FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Martinez', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'Pumas UNAM', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Quinones', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'Al Qadsiah FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Santiago Giménez', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'Feyenoord', formIndicator: '⭐ Stable', stats: '24 Goals, 6 Assists', age: 25, goals: 24, assists: 6, caps: 25, marketValue: 40, popularity: 85, form: 8.4 },
        { name: 'Vega', team: 'Mexico', pos: 'Forward', subPos: 'Striker', club: 'Deportivo Toluca FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Morocco
        { name: 'El Kajoui', team: 'Morocco', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'RS Berkane', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 37, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Tagnaouti', team: 'Morocco', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'ASFAR', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Yassine Bounou', team: 'Morocco', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Hilal', formIndicator: '⭐ Stable', stats: '18 CS, 80 Saves', age: 35, caps: 65, marketValue: 12, popularity: 87, form: 8.8, cleanSheets: 18, saves: 80, savePct: 78 },
        { name: 'Achraf Hakimi', team: 'Morocco', pos: 'Defender', subPos: 'Full-Back', club: 'PSG', formIndicator: '⭐ Stable', stats: '8 Goals, 12 Assists', age: 27, goals: 8, assists: 12, caps: 72, marketValue: 65, popularity: 90, form: 8.9 },
        { name: 'Aguerd', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'Olympique Marseille', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Belammari', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ahly FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Diop', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'Fulham FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'El Ouahdi', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'KRC Genk', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Halhal', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'KV Mechelen', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mazraoui', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Riad', team: 'Morocco', pos: 'Defender', subPos: 'Centre-Back', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Amrabat', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Betis', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bouaddi', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Lille OSC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 18, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'El Aynaoui', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AS Roma', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'El Khannouss', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'El Mourabet', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'RC Strasbourg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Ounahi', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Girona FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Saibari', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Talbi', team: 'Morocco', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Amaimouni', team: 'Morocco', pos: 'Forward', subPos: 'Striker', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Brahim Díaz', team: 'Morocco', pos: 'Forward', subPos: 'Attacking Midfielder', club: 'Real Madrid', formIndicator: '📈 Form', stats: '9 Goals, 7 Assists', age: 26, goals: 9, assists: 7, caps: 6, marketValue: 40, popularity: 86, form: 8.7 },
        { name: 'El Kaabi', team: 'Morocco', pos: 'Forward', subPos: 'Striker', club: 'Olympiacos FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ezzalzouli', team: 'Morocco', pos: 'Forward', subPos: 'Striker', club: 'Real Betis', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Rahimi', team: 'Morocco', pos: 'Forward', subPos: 'Striker', club: 'Al Ain FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Netherlands
        { name: 'Bart Verbruggen', team: 'Netherlands', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Brighton', formIndicator: '📈 Rising', stats: '10 CS, 65 Saves', age: 23, caps: 8, marketValue: 20, popularity: 75, form: 8.4, cleanSheets: 10, saves: 65, savePct: 74 },
        { name: 'Flekken', team: 'Netherlands', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Bayer 04 Leverkusen', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Roefs', team: 'Netherlands', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ake', team: 'Netherlands', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hato', team: 'Netherlands', pos: 'Defender', subPos: 'Centre-Back', club: 'Chelsea FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 20, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Timber', team: 'Netherlands', pos: 'Defender', subPos: 'Centre-Back', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Van De Ven', team: 'Netherlands', pos: 'Defender', subPos: 'Centre-Back', club: 'Tottenham Hotspur FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Van Hecke', team: 'Netherlands', pos: 'Defender', subPos: 'Centre-Back', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Virgil van Dijk', team: 'Netherlands', pos: 'Defender', subPos: 'Centre-Back', club: 'Liverpool', formIndicator: '🔥 Captain', stats: '66 Caps, 4 Goals', age: 34, goals: 4, assists: 2, caps: 66, marketValue: 30, popularity: 92, form: 9.2 },
        { name: 'De Jong', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Barcelona', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'De Roon', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gravenberch', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Liverpool FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kluivert', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AFC Bournemouth', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Koopmeiners', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Juventus FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Reijnders', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ries', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Internazionale Milano', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Til', team: 'Netherlands', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Xavi Simons', team: 'Netherlands', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'RB Leipzig', formIndicator: '🔥 Spark', stats: '10 Goals, 15 Assists', age: 23, goals: 10, assists: 15, caps: 13, marketValue: 80, popularity: 88, form: 9 },
        { name: 'Brobbey', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Cody Gakpo', team: 'Netherlands', pos: 'Forward', subPos: 'Winger', club: 'Liverpool', formIndicator: '📈 Form', stats: '12 Goals, 6 Assists', age: 27, goals: 12, assists: 6, caps: 24, marketValue: 50, popularity: 85, form: 8.7 },
        { name: 'Depay', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'SC Corinthians', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ieffer', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Lang', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Malen', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'AS Roma', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Summerville', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'West Ham United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Weghorst', team: 'Netherlands', pos: 'Forward', subPos: 'Striker', club: 'AFC Ajax', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // New Zealand
        { name: 'Crocombe', team: 'New Zealand', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Millwall FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Paulsen', team: 'New Zealand', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Lechia Gda ń sk', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Woud', team: 'New Zealand', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Auckland FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Bindon', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'She eld United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Boxall', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Minnesota United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 37, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cacace', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Wrexham AFC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'De Vries', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Auckland FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Elliot', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Auckland FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Payne', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Wellington Phoenix FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Pijnaker', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Auckland FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Surman', team: 'New Zealand', pos: 'Defender', subPos: 'Centre-Back', club: 'Portland Timbers', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Bayliss', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Newcastle United Jets FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bell', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Viking Stavanger', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Garbett', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Peterborough United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Just', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Motherwell FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mccowatt', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Silkeborg IF', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Old', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AS Saint-Etienne', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rufer', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Wellington Phoenix FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Singh', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Wellington Phoenix FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Stamenic', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Swansea City AFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Thomas', team: 'New Zealand', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'PEC Zwolle', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Barbarouses', team: 'New Zealand', pos: 'Forward', subPos: 'Striker', club: 'WS Wanderers FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 36, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Randall', team: 'New Zealand', pos: 'Forward', subPos: 'Striker', club: 'Auckland FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Waine', team: 'New Zealand', pos: 'Forward', subPos: 'Striker', club: 'Port Vale FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Wood', team: 'New Zealand', pos: 'Forward', subPos: 'Striker', club: 'Nottingham Forest FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Nigeria
        { name: 'Ademola Lookman', team: 'Nigeria', pos: 'Forward', subPos: 'Winger', club: 'Atalanta', formIndicator: '🔥 Hot', stats: '17 Goals, 10 Assists', age: 28, goals: 17, assists: 10, caps: 19, marketValue: 40, popularity: 88, form: 9.3 },
        // Norway
        { name: 'Nyland', team: 'Norway', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Sevilla FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 35, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Selvik', team: 'Norway', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Watford FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 28, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Tangvik', team: 'Norway', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Hamburger SV', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Ajer', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Brentford FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bjorkan', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'FK Bodø/Glimt', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Falchener', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Viking Stavanger', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Heggem', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Bologna FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Holmgren Pedersen', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Torino FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Langas', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Derby County FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Moller Wolfe', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Wolverhampton Wanderers FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ostigard', team: 'Norway', pos: 'Defender', subPos: 'Centre-Back', club: 'Genoa CFC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Aasgaard', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Rangers FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Aursnes', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Berg', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FK Bodø/Glimt', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Berge', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Fulham FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bobb', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Fulham FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Hauge', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FK Bodø/Glimt', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Martin Ødegaard', team: 'Norway', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Arsenal', formIndicator: '🔥 Maestro', stats: '3 Goals, 10 Assists', age: 27, goals: 3, assists: 10, caps: 59, marketValue: 110, popularity: 91, form: 9 },
        { name: 'Odegaard', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Schjelderup', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Thorsby', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'US Cremonese', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Thorstvedt', team: 'Norway', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'US Sassuolo', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Erling Haaland', team: 'Norway', pos: 'Forward', subPos: 'Striker', club: 'Manchester City', formIndicator: '🔥 Terminator', stats: '31 Goals, 8 Assists', age: 25, goals: 31, assists: 8, caps: 33, marketValue: 180, popularity: 97, form: 9.5 },
        { name: 'Nusa', team: 'Norway', pos: 'Forward', subPos: 'Striker', club: 'RB Leipzig', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Sorloth', team: 'Norway', pos: 'Forward', subPos: 'Striker', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Strand Larsen', team: 'Norway', pos: 'Forward', subPos: 'Striker', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Panama
        { name: 'Mejia', team: 'Panama', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Club Nacional', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 35, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mosquera', team: 'Panama', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Fayha FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Samudio', team: 'Panama', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'CD Marathón', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Andrade', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'LASK Linz', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Blackman', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Š K Slovan Bratislava', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cordoba', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Norwich City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Davis', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'CD Plaza Amador', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Escobar', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Deportivo Saprissa', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Farina', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Pari Nizhny Novgorod', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Harvey', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Minnesota United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Miller', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Turan Tovuz', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Murillo', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Be ş ikta ş  JK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ramos', team: 'Panama', pos: 'Defender', subPos: 'Centre-Back', club: 'Puerto Cabello CF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Barcenas', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Mazatlán FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Carrasquilla', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pumas UNAM', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Diaz', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Club León', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Godoy', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'San Diego FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 36, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Martinez', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Hapoel Kiryat Shmona FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Quintero', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CD Plaza Amador', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 38, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rodriguez', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Juárez', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yanis', team: 'Panama', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CD Cobresal', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Fajardo', team: 'Panama', pos: 'Forward', subPos: 'Striker', club: 'CD Universidad Católica', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Londono', team: 'Panama', pos: 'Forward', subPos: 'Striker', club: 'CD Universidad Católica', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Waterman', team: 'Panama', pos: 'Forward', subPos: 'Striker', club: 'CD Universidad De Concepción', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Paraguay
        { name: 'Fernandez', team: 'Paraguay', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Cerro Porteño', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 38, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Gill', team: 'Paraguay', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'CA San Lorenzo', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Olveira', team: 'Paraguay', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Club Olimpia', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Alderete', team: 'Paraguay', pos: 'Defender', subPos: 'Centre-Back', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alonso', team: 'Paraguay', pos: 'Defender', subPos: 'Centre-Back', club: 'Atlético Mineiro', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Balbuena', team: 'Paraguay', pos: 'Defender', subPos: 'Centre-Back', club: 'Grêmio FBPA', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Caceres', team: 'Paraguay', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Dynamo Moscow', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Canale', team: 'Paraguay', pos: 'Defender', subPos: 'Centre-Back', club: 'CA Lanús', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Velazquez', team: 'Paraguay', pos: 'Defender', subPos: 'Centre-Back', club: 'Cerro Porteño', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Almiron', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlanta United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bobadilla', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'São Paulo FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Caballero', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Portsmouth FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cubas', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Vancouver Whitecaps FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Galarza', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlanta United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gomez', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mauricio', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SE Palmeiras', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ojeda', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Orlando City SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sosa', team: 'Paraguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SE Palmeiras', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Arce', team: 'Paraguay', pos: 'Forward', subPos: 'Striker', club: 'CS Independiente Rivadavia', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Avalos', team: 'Paraguay', pos: 'Forward', subPos: 'Striker', club: 'CA Independiente', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Enciso', team: 'Paraguay', pos: 'Forward', subPos: 'Striker', club: 'RC Strasbourg', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Pitta', team: 'Paraguay', pos: 'Forward', subPos: 'Striker', club: 'Red Bull Bragantino', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Romero Gamarra', team: 'Paraguay', pos: 'Forward', subPos: 'Striker', club: 'Al Ain FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Sanabria', team: 'Paraguay', pos: 'Forward', subPos: 'Striker', club: 'US Cremonese', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Portugal
        { name: 'Diogo Costa', team: 'Portugal', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Porto', formIndicator: '🔥 Pen Stopper', stats: '19 CS, 76 Saves', age: 26, caps: 22, marketValue: 45, popularity: 86, form: 9, cleanSheets: 19, saves: 76, savePct: 80 },
        { name: 'Jose Sa', team: 'Portugal', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Wolverhampton Wanderers FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 33, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Diogo Dalot', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Goncalo Inacio', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'Sporting CP', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Joao Cancelo', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Barcelona', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nelson', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nuno Mendes', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Renato Veiga', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'Villarreal CF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Rúben Dias', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City', formIndicator: '🔥 Solid', stats: '56 Caps, 1 Goal', age: 29, goals: 1, assists: 2, caps: 56, marketValue: 80, popularity: 89, form: 9 },
        { name: 'Tomas Araujo', team: 'Portugal', pos: 'Defender', subPos: 'Centre-Back', club: 'SL Ben ca', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bernardo Silva', team: 'Portugal', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Manchester City', formIndicator: '⭐ Stable', stats: '11 Goals, 12 Assists', age: 31, goals: 11, assists: 12, caps: 88, marketValue: 70, popularity: 88, form: 8.5 },
        { name: 'Bruno Fernandes', team: 'Portugal', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Manchester United', formIndicator: '⭐ Engine', stats: '20 Goals, 22 Assists', age: 31, goals: 20, assists: 22, caps: 64, marketValue: 70, popularity: 90, form: 8.8 },
        { name: 'João Neves', team: 'Portugal', pos: 'Midfielder', subPos: 'Defensive Midfielder', club: 'PSG', formIndicator: '📈 Young Star', stats: '2 Goals, 4 Assists', age: 21, goals: 2, assists: 4, caps: 7, marketValue: 55, popularity: 85, form: 8.8 },
        { name: 'Matheus', team: 'Portugal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Vitinha', team: 'Portugal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cristiano Ronaldo', team: 'Portugal', pos: 'Forward', subPos: 'Striker', club: 'Al Nassr', formIndicator: '🔥 Legend', stats: '128 Goals, 46 Assists', age: 41, goals: 128, assists: 46, caps: 206, marketValue: 15, popularity: 99, form: 8.9 },
        { name: 'Francisco Trincao', team: 'Portugal', pos: 'Forward', subPos: 'Striker', club: 'Sporting CP', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Goncalo Guedes', team: 'Portugal', pos: 'Forward', subPos: 'Striker', club: 'Real Sociedad', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Goncalo Ramos', team: 'Portugal', pos: 'Forward', subPos: 'Striker', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Joao Felix', team: 'Portugal', pos: 'Forward', subPos: 'Striker', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Pedro Neto', team: 'Portugal', pos: 'Forward', subPos: 'Striker', club: 'Chelsea FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Rafael Leão', team: 'Portugal', pos: 'Forward', subPos: 'Winger', club: 'AC Milan', formIndicator: '📈 Spark', stats: '15 Goals, 14 Assists', age: 26, goals: 15, assists: 14, caps: 26, marketValue: 90, popularity: 89, form: 8.7 },
        // Qatar
        { name: 'Mahmoud Abunada', team: 'Qatar', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Rayyan SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Meshaal Barsham', team: 'Qatar', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Sadd SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 28, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Salah Zakaria', team: 'Qatar', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Alhashmi', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Arabi SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Ayoub Aloui', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Gharafa SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Boualem', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Sadd SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Homam Ahmed', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Cultural Leonesa', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Issa Laye', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Arabi SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jassem Gaber', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Rayyan SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lucas Mendes', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Wakrah SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Pedro Miguel', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Sadd SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sultan Albrake', team: 'Qatar', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Abdulaziz Hatem', team: 'Qatar', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Rayyan SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 36, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ahmed Alganehi', team: 'Qatar', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Gharafa SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ahmed Fathy', team: 'Qatar', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Arabi SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Assim Madibo', team: 'Qatar', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Wakrah SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Karim Boudiaf', team: 'Qatar', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 35, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ahmed Alaaeldin', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Rayyan SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Akram Afif', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Sadd SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Almoez Ali', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Edmilson', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Hassan Alhaydos', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Sadd SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 35, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mohammed Muntari', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Gharafa SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Tahsin Jamshid', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Duhail SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 19, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Yusuf Abdurisag', team: 'Qatar', pos: 'Forward', subPos: 'Striker', club: 'Al Wakrah SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Saudi Arabia
        { name: 'Ahmed Alkassar', team: 'Saudi Arabia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Qadsiah FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 35, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mohammed Alowais', team: 'Saudi Arabia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Ula Saudi FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 34, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Nawaf Alaqidi', team: 'Saudi Arabia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 26, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Abdulelah Alamri', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ali Lajami', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ali Majrashi', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hassan Altambakti', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hassan Kadish', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ittihad', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jehad Thikri', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Qadsiah FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Moteb Alharbi', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nawaf Bu Washl', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Saud Abdulhamid', team: 'Saudi Arabia', pos: 'Defender', subPos: 'Centre-Back', club: 'RC Lens', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Abdullah Alkhaibari', team: 'Saudi Arabia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ala Alhajji', team: 'Saudi Arabia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Neom SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mohamed Kanno', team: 'Saudi Arabia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Musab Aljuwayr', team: 'Saudi Arabia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Qadsiah FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Nasser Aldawsari', team: 'Saudi Arabia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ziyad Aljohani', team: 'Saudi Arabia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Abdullah Alhamddan', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Aiman Yahya', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Feras Albrikan', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Khalid Alghannam', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Ettifaq FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Saleh', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Ittihad', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Salem Aldawsari', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Sultan Mandash', team: 'Saudi Arabia', pos: 'Forward', subPos: 'Striker', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 31, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Scotland
        { name: 'Gordon', team: 'Scotland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Heart Of Midlothian FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 43, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Gunn', team: 'Scotland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Nottingham Forest FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Kelly', team: 'Scotland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Rangers FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Hanley', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Hibernian FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hendry', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ettifaq FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hickey', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Brentford FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hyam', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Wrexham AFC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Patterson', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Everton FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ralston', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Robertson', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Liverpool FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Souttar', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Rangers FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tierney', team: 'Scotland', pos: 'Defender', subPos: 'Centre-Back', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Christie', team: 'Scotland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AFC Bournemouth', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ferguson', team: 'Scotland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bologna FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Fletcher', team: 'Scotland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Manchester United FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 19, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Mcginn', team: 'Scotland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mclean', team: 'Scotland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Norwich City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 34, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mctominay', team: 'Scotland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SSC Napoli', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Adams', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'Torino FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Curtis', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'Kilmarnock FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Dykes', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'Charlton Athletic FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gannon-doak', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'AFC Bournemouth', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Hirst', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'Ipswich Town FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Shankland', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'Heart Of Midlothian FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Stewart', team: 'Scotland', pos: 'Forward', subPos: 'Striker', club: 'Southampton FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Senegal
        { name: 'Diaw', team: 'Senegal', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Le Havre AC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Diatta', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'AS Monaco', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Diouf', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'West Ham United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Jakobs', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Koulibaly', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Hilal SC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mendy', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'OGC Nice', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Niakhate', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'Olympique Lyonnais', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sarr', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'Chelsea FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 20, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Seck', team: 'Senegal', pos: 'Defender', subPos: 'Centre-Back', club: 'Maccabi Haifa FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 34, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Camara Lamine', team: 'Senegal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Monaco', formIndicator: '📈 Form', stats: '5 Goals, 6 Assists', age: 22, goals: 5, assists: 6, caps: 15, marketValue: 15, popularity: 78, form: 8.4 },
        { name: 'Ciss', team: 'Senegal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Rayo Vallecano', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Diarra', team: 'Senegal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Gueye', team: 'Senegal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Everton FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 36, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ndiaye', team: 'Senegal', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Bayern München', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 18, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Diao', team: 'Senegal', pos: 'Forward', subPos: 'Striker', club: 'Como', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 20, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Dieng', team: 'Senegal', pos: 'Forward', subPos: 'Striker', club: 'FC Lorient', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mane', team: 'Senegal', pos: 'Forward', subPos: 'Striker', club: 'Al Nassr FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 34, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Mbaye', team: 'Senegal', pos: 'Forward', subPos: 'Striker', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 18, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Nicolas Jackson', team: 'Senegal', pos: 'Forward', subPos: 'Striker', club: 'Chelsea', formIndicator: '📈 Improving', stats: '15 Goals, 6 Assists', age: 24, goals: 15, assists: 6, caps: 14, marketValue: 35, popularity: 84, form: 8.6 },
        // South Africa
        { name: 'Chaine', team: 'South Africa', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Goss', team: 'South Africa', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Siwelele FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Williams', team: 'South Africa', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 34, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Kabini', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Molde FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Makhanya', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Philadelphia Union', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Matuludi', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Polokwane City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mbokazi', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Chicago Fire FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 20, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Modiba', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mudau', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ndamane', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Okon', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Hannover 96', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Sibisi', team: 'South Africa', pos: 'Defender', subPos: 'Centre-Back', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Adams', team: 'South Africa', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mbatha', team: 'South Africa', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mokoena', team: 'South Africa', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sithole', team: 'South Africa', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'CD Tondela', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zwane', team: 'South Africa', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 36, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Appollis', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Foster', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Burnley FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Makgopa', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Maseko', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'AEL Limassol', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Mofokeng', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 21, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Moremi', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Rayners', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Mamelodi Sundowns FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Sebelebele', team: 'South Africa', pos: 'Forward', subPos: 'Striker', club: 'Orlando Pirates FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // South Korea
        { name: 'Jo', team: 'South Korea', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Ulsan HD', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 34, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Kim', team: 'South Korea', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Tokyo', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 35, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Song', team: 'South Korea', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Jeonbuk Hyundai Motors FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 28, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Castrop', team: 'South Korea', pos: 'Defender', subPos: 'Centre-Back', club: 'Borussia Mönchengladbach', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Lee', team: 'South Korea', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Midtjylland', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Park', team: 'South Korea', pos: 'Defender', subPos: 'Centre-Back', club: 'Zhejiang FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Seol', team: 'South Korea', pos: 'Defender', subPos: 'Centre-Back', club: 'FK Crvena Zvezda', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bae', team: 'South Korea', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Stoke City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Eom', team: 'South Korea', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Swansea City AFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hwang', team: 'South Korea', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Feyenoord Rotterdam', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Paik', team: 'South Korea', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Birmingham City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yang', team: 'South Korea', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Cho', team: 'South Korea', pos: 'Forward', subPos: 'Striker', club: 'FC Midtjylland', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Oh', team: 'South Korea', pos: 'Forward', subPos: 'Striker', club: 'Be ş ikta ş  JK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Son Heung-min', team: 'South Korea', pos: 'Forward', subPos: 'Winger', club: 'Tottenham', formIndicator: '⭐ Legend', stats: '44 Goals, 25 Assists', age: 33, goals: 44, assists: 25, caps: 123, marketValue: 45, popularity: 93, form: 9 },
        // Spain
        { name: 'Raya', team: 'Spain', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Arsenal FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Unai Simón', team: 'Spain', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Athletic Bilbao', formIndicator: '⭐ Solid', stats: '17 CS, 92 Saves', age: 28, caps: 40, marketValue: 30, popularity: 81, form: 8.6, cleanSheets: 17, saves: 92, savePct: 78 },
        { name: 'Cubarsi', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Barcelona', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 19, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Cucurella', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'Chelsea FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Garcia', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Barcelona', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Grimaldo', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'Bayer 04 Leverkusen', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Laporte', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'Athletic Club', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Llorente', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Porro', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'Tottenham Hotspur FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Pubill', team: 'Spain', pos: 'Defender', subPos: 'Centre-Back', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Baena', team: 'Spain', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Atlético De Madrid', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Dani Olmo', team: 'Spain', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Barcelona', formIndicator: '🔥 In Form', stats: '12 Goals, 8 Assists', age: 28, goals: 12, assists: 8, caps: 39, marketValue: 60, popularity: 86, form: 8.9 },
        { name: 'Gavi', team: 'Spain', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Barcelona', formIndicator: '⭐ Returning', stats: '5 Goals, 6 Assists', age: 21, goals: 5, assists: 6, caps: 27, marketValue: 90, popularity: 90, form: 8.4 },
        { name: 'Merino', team: 'Spain', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Pedri', team: 'Spain', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Barcelona', formIndicator: '📈 Rising', stats: '4 Goals, 8 Assists', age: 23, goals: 4, assists: 8, caps: 24, marketValue: 80, popularity: 91, form: 8.7 },
        { name: 'Rodri', team: 'Spain', pos: 'Midfielder', subPos: 'Defensive Midfielder', club: 'Manchester City', formIndicator: '🔥 Masterclass', stats: '9 Goals, 14 Assists', age: 29, goals: 9, assists: 14, caps: 49, marketValue: 120, popularity: 95, form: 9.8 },
        { name: 'Ruiz', team: 'Spain', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zubimendi', team: 'Spain', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Arsenal FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lamine Yamal', team: 'Spain', pos: 'Forward', subPos: 'Winger', club: 'Barcelona', formIndicator: '🔥 Sensational', stats: '7 Goals, 14 Assists', age: 18, goals: 7, assists: 14, caps: 14, marketValue: 120, popularity: 98, form: 9.7 },
        { name: 'Munoz', team: 'Spain', pos: 'Forward', subPos: 'Striker', club: 'CA Osasuna', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 22, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Nico Williams', team: 'Spain', pos: 'Forward', subPos: 'Winger', club: 'Athletic Bilbao', formIndicator: '🔥 Speed', stats: '8 Goals, 17 Assists', age: 23, goals: 8, assists: 17, caps: 20, marketValue: 70, popularity: 92, form: 9.1 },
        { name: 'Oyarzabal', team: 'Spain', pos: 'Forward', subPos: 'Striker', club: 'Real Sociedad', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Pino', team: 'Spain', pos: 'Forward', subPos: 'Striker', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Torres', team: 'Spain', pos: 'Forward', subPos: 'Striker', club: 'FC Barcelona', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Sweden
        { name: 'Widell Zetterstrom', team: 'Sweden', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Derby County FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Bernhardsson', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Holstein Kiel', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ekdal', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Burnley FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Eldt', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'AIK Stockholm', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 36, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Gudmundsson', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Leeds United FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Hien', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Atalanta Bergamo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Johansson', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Dallas', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lagerbielke', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'SC Braga', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Lindelof', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Aston Villa FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Smith', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'FC St. Pauli', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Starfelt', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'RC Celta Vigo', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Stroud', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Mjällby AIF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Svensson', team: 'Sweden', pos: 'Defender', subPos: 'Centre-Back', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ayari', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Bergvall', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Tottenham Hotspur FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Karlstrom', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Udinese', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Nygren', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sema', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pafos FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Svanberg', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'VfL Wolfsburg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zeneli', team: 'Sweden', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Royale Union Saint-Gilloise', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Elanga', team: 'Sweden', pos: 'Forward', subPos: 'Striker', club: 'Newcastle United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Gyokeres', team: 'Sweden', pos: 'Forward', subPos: 'Striker', club: 'Arsenal FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Isak', team: 'Sweden', pos: 'Forward', subPos: 'Striker', club: 'Liverpool FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Nilsson', team: 'Sweden', pos: 'Forward', subPos: 'Striker', club: 'Club Brugge', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Switzerland
        { name: 'Keller', team: 'Switzerland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'BSC Young Boys', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 23, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Kobel', team: 'Switzerland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 28, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Mvogo', team: 'Switzerland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FC Lorient', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 32, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Yann Sommer', team: 'Switzerland', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Inter Milan', formIndicator: '⭐ Experienced', stats: '19 CS, 88 Saves', age: 37, caps: 90, marketValue: 5, popularity: 83, form: 8.6, cleanSheets: 19, saves: 88, savePct: 79 },
        { name: 'Akanji', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Internazionale Milano', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Amenda', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Coemert', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'Valencia CF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Elvedi', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'Borussia Mönchengladbach', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jaquez', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'VfB Stuttgart', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Muheim', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'Hamburger SV', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Rodriguez', team: 'Switzerland', pos: 'Defender', subPos: 'Centre-Back', club: 'Real Betis', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Aebischer', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pisa SC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Freuler', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bologna FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 34, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Jashari', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AC Milan', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Manzambi', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'SC Freiburg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 20, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Rieder', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Augsburg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sow', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sevilla FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Xhaka', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Sunderland AFC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 33, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Zakaria', team: 'Switzerland', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AS Monaco', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Embolo', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: 'Stade Rennais FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 29, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Fassnacht', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: 'BSC Young Boys', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 32, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Idmer', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: '1. FSV Mainz 05', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Ndoye', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: 'Nottingham Forest FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Okafor', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: 'Leeds United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Vargas', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: 'Sevilla FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Zeki Amdouni', team: 'Switzerland', pos: 'Forward', subPos: 'Striker', club: 'Benfica', formIndicator: '⭐ Stable', stats: '8 Goals, 2 Assists', age: 25, goals: 8, assists: 2, caps: 19, marketValue: 18, popularity: 79, form: 8.1 },
        // Tunisia
        { name: 'Ben Hessen', team: 'Tunisia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Étoile Du Sahel', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Chamakh', team: 'Tunisia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Club Africain', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 24, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Dahmen', team: 'Tunisia', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'CS Sfaxien', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 29, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Abdi', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'OGC Nice', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Arous', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'Kasımpa ş a SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Ben Hmida', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'Espérance De Tunisie', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ben Ouanes', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'Kasımpa ş a SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bronn', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'Servette FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Chikhaoui', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'US Monastir', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Neffati', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'IFK Norrköping FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Rekik', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'NK Maribor', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 24, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Talbi', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'FC Lorient', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Valery', team: 'Tunisia', pos: 'Defender', subPos: 'Centre-Back', club: 'BSC Young Boys', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ayari', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Paris Saint-Germain', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 21, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Gharbi', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Augsburg', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Hadj Mahmoud', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Lugano', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 26, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Khedira', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: '1. FC Union Berlin', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mejbri', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Burnley FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Skhiri', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Eintracht Frankfurt', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Slimane', team: 'Tunisia', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Norwich City FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Achouri', team: 'Tunisia', pos: 'Forward', subPos: 'Striker', club: 'FC København', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Chaouat', team: 'Tunisia', pos: 'Forward', subPos: 'Striker', club: 'Club Africain', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Elloumi', team: 'Tunisia', pos: 'Forward', subPos: 'Striker', club: 'Vancouver Whitecaps FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 18, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 78, form: 8.2 },
        { name: 'Mastouri', team: 'Tunisia', pos: 'Forward', subPos: 'Striker', club: 'FC Dynamo Makhachkala', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Saad', team: 'Tunisia', pos: 'Forward', subPos: 'Striker', club: 'Hannover 96', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Türkiye
        { name: 'Bayindir', team: 'Türkiye', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Manchester United FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 28, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Cakir', team: 'Türkiye', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Gunok', team: 'Türkiye', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 37, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Akaydin', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Çaykur Rizespor', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 32, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Bardakci', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 31, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Celik', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'AS Roma', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Demiral', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Al Ahli FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Elmali', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kabak', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'TSG Hoffenheim', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kadioglu', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Brighton & Hove Albion FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Muldur', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Soyuncu', team: 'Türkiye', pos: 'Defender', subPos: 'Centre-Back', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 30, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Arda Güler', team: 'Türkiye', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Real Madrid', formIndicator: '📈 Wonderkid', stats: '6 Goals, 4 Assists', age: 21, goals: 6, assists: 4, caps: 12, marketValue: 45, popularity: 90, form: 8.9 },
        { name: 'Ayhan', team: 'Türkiye', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Calhanoglu', team: 'Türkiye', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FC Internazionale Milano', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Kokcu', team: 'Türkiye', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Be ş ikta ş  JK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ozcan', team: 'Türkiye', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Borussia Dortmund', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Yuksek', team: 'Türkiye', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Akgun', team: 'Türkiye', pos: 'Forward', subPos: 'Striker', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Akturkoglu', team: 'Türkiye', pos: 'Forward', subPos: 'Striker', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 27, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Aydin', team: 'Türkiye', pos: 'Forward', subPos: 'Striker', club: 'Fenerbahçe SK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kahveci', team: 'Türkiye', pos: 'Forward', subPos: 'Striker', club: 'Kasımpa ş a SK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Kenan Yildiz', team: 'Türkiye', pos: 'Forward', subPos: 'Winger', club: 'Juventus', formIndicator: '📈 Young Talent', stats: '4 Goals, 3 Assists', age: 21, goals: 4, assists: 3, caps: 8, marketValue: 30, popularity: 85, form: 8.4 },
        { name: 'Yilmaz', team: 'Türkiye', pos: 'Forward', subPos: 'Striker', club: 'Galatasaray SK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Ukraine
        { name: 'Andriy Lunin', team: 'Ukraine', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Real Madrid', formIndicator: '⭐ Reliable', stats: '12 CS, 72 Saves', age: 27, caps: 12, marketValue: 25, popularity: 85, form: 8.7, cleanSheets: 12, saves: 72, savePct: 80 },
        { name: 'Georgiy Sudakov', team: 'Ukraine', pos: 'Midfielder', subPos: 'Attacking Midfielder', club: 'Shakhtar', formIndicator: '⭐ Creative', stats: '10 Goals, 12 Assists', age: 23, goals: 10, assists: 12, caps: 14, marketValue: 35, popularity: 80, form: 8.5 },
        { name: 'Artem Dovbyk', team: 'Ukraine', pos: 'Forward', subPos: 'Striker', club: 'Roma', formIndicator: '⭐ Stable', stats: '24 Goals, 8 Assists', age: 28, goals: 24, assists: 8, caps: 26, marketValue: 35, popularity: 83, form: 8.7 },
        // United States
        { name: 'Brady', team: 'United States', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Chicago Fire FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 22, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 78, form: 8.2, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Freese', team: 'United States', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'New York City FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 27, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Turner', team: 'United States', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'New England Revolution', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 31, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Arfsten', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Columbus Crew', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Dest', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 25, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Freeman', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Villarreal CF', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 21, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Mckenzie', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Toulouse FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ream', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Charlotte FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 38, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Richards', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Crystal Palace FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Robinson', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Fulham FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Scally', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Borussia Mönchengladbach', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 23, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Trusty', team: 'United States', pos: 'Defender', subPos: 'Centre-Back', club: 'Celtic FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Adams', team: 'United States', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'AFC Bournemouth', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Berhalter', team: 'United States', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Vancouver Whitecaps FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Reyna', team: 'United States', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Borussia Mönchengladbach', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Roldan', team: 'United States', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Seattle Sounders FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 31, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Tillman', team: 'United States', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Bayer 04 Leverkusen', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 24, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Weston McKennie', team: 'United States', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Juventus', formIndicator: '⭐ Solid', stats: '11 Goals, 9 Assists', age: 27, goals: 11, assists: 9, caps: 49, marketValue: 28, popularity: 82, form: 8.2 },
        { name: 'Aaronson', team: 'United States', pos: 'Forward', subPos: 'Striker', club: 'Leeds United FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 25, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Balogun', team: 'United States', pos: 'Forward', subPos: 'Striker', club: 'AS Monaco', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 24, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Christian Pulisic', team: 'United States', pos: 'Forward', subPos: 'Winger', club: 'AC Milan', formIndicator: '🔥 Captain America', stats: '28 Goals, 16 Assists', age: 27, goals: 28, assists: 16, caps: 64, marketValue: 40, popularity: 90, form: 9.3 },
        { name: 'Pepi', team: 'United States', pos: 'Forward', subPos: 'Striker', club: 'PSV Eindhoven', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 23, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Weah', team: 'United States', pos: 'Forward', subPos: 'Striker', club: 'Olympique Marseille', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 26, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Wright', team: 'United States', pos: 'Forward', subPos: 'Striker', club: 'Coventry City FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        // Uruguay
        { name: 'Federico Valverde', team: 'Uruguay', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Real Madrid', formIndicator: '🔥 Engine', stats: '6 Goals, 8 Assists', age: 27, goals: 6, assists: 8, caps: 56, marketValue: 120, popularity: 92, form: 9.3 },
        { name: 'Darwin Núñez', team: 'Uruguay', pos: 'Forward', subPos: 'Striker', club: 'Liverpool', formIndicator: '⚡ Chaos', stats: '18 Goals, 8 Assists', age: 26, goals: 18, assists: 8, caps: 25, marketValue: 70, popularity: 88, form: 8.6 },
        // Uzbekistan
        { name: 'Ergashev', team: 'Uzbekistan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'FK Neftchi Farg\'ona', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 30, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Nematov', team: 'Uzbekistan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'Nasaf Qarshi FC', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 25, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Yusupov', team: 'Uzbekistan', pos: 'Goalkeeper', subPos: 'Goalkeeper', club: 'PFC Navbahor Namangan', formIndicator: 'Squad', stats: '8 CS, 60 Saves', age: 35, goals: 0, assists: 0, caps: 5, marketValue: 15, popularity: 72, form: 7.8, cleanSheets: 8, saves: 60, savePct: 74 },
        { name: 'Abdullaev', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Dibba FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 28, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Alijonov', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Pakhtakor Tashkent FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ashurmatov', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Esteghlal Tehran FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 29, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Eshmurodov', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Nasaf Qarshi FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 33, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Karimov', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Surkhon FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 18, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Khusanov', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Manchester City FC', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 22, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Nasrullaev', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'Pakhtakor Tashkent FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 27, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Sayfiev', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'FK Neftchi Farg\'ona', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 35, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Ulmasaliyev', team: 'Uzbekistan', pos: 'Defender', subPos: 'Centre-Back', club: 'OKMK FK', formIndicator: 'Squad', stats: '1 Goals, 1 Assists', age: 26, goals: 1, assists: 1, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Esanov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FK Buxoro', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 23, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Fayzullaev', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Ba ş ak ş ehir FK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 22, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 78, form: 8.2 },
        { name: 'Ganiev', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Al Bataeh Club', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 28, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Iskanderov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'FK Neftchi Farg\'ona', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Khamdamov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pakhtakor Tashkent FK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Masharipov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Esteghlal Tehran FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 32, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Mozgovoy', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Pakhtakor Tashkent FK', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 27, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Shukurov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Baniyas Club', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 29, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Urunov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Persepolis FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 25, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Xamrobekov', team: 'Uzbekistan', pos: 'Midfielder', subPos: 'Central Midfielder', club: 'Tractor Sazi Tabriz FC', formIndicator: 'Squad', stats: '1 Goals, 2 Assists', age: 30, goals: 1, assists: 2, caps: 5, marketValue: 15, popularity: 72, form: 7.8 },
        { name: 'Amonov', team: 'Uzbekistan', pos: 'Forward', subPos: 'Striker', club: 'FK Dinamo Samarkand', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 28, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Sergeev', team: 'Uzbekistan', pos: 'Forward', subPos: 'Striker', club: 'Persepolis FC', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 33, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
        { name: 'Shomurodov', team: 'Uzbekistan', pos: 'Forward', subPos: 'Striker', club: 'Ba ş ak ş ehir FK', formIndicator: 'Squad', stats: '2 Goals, 1 Assists', age: 30, goals: 2, assists: 1, caps: 5, marketValue: 25, popularity: 72, form: 7.8 },
      ];

      // Official tournament results for WC prediction scoring (stored in DB via /api/wc/results).
      // Leave empty until matches are played; points are only awarded for correct predictions.
      const WC_RESULTS = {
        matches: {},
        awards: {},
        groups: {},
        third_place: [],
        bracket: [],
        champion: null,
      };

      const WC_FIXTURES = [
        { id: 1, home: 'Mexico', away: 'South Korea', date: 'Jun 11', time: '15:00', venue: 'Estadio Azteca, Mexico City', group: 'Group A' },
        { id: 2, home: 'Canada', away: 'Switzerland', date: 'Jun 12', time: '12:00', venue: 'BC Place, Vancouver', group: 'Group B' },
        { id: 3, home: 'Brazil', away: 'Morocco', date: 'Jun 12', time: '18:00', venue: 'MetLife Stadium, NY/NJ', group: 'Group C' },
        { id: 4, home: 'United States', away: 'Türkiye', date: 'Jun 13', time: '16:00', venue: 'SoFi Stadium, Los Angeles', group: 'Group D' }
      ];

      if (typeof QUESTIONS_EXTRA !== 'undefined') {
        for (const [cat, extra] of Object.entries(QUESTIONS_EXTRA)) {
          if (QUESTIONS[cat]) QUESTIONS[cat] = QUESTIONS[cat].concat(extra);
        }
      }
      CATEGORIES_DATA.forEach(c => {
        if (QUESTIONS[c.id]) c.count = QUESTIONS[c.id].length + ' questions';
      });

      window.QUESTIONS = QUESTIONS;
      window.LEADERBOARD_DATA = LEADERBOARD_DATA;
      window.CATEGORIES_DATA = CATEGORIES_DATA;
      window.TRANSFER_PLAYERS = TRANSFER_PLAYERS;
      window.LOGO_URLS = LOGO_URLS;
      window.COUNTRY_CODES = COUNTRY_CODES;
      window.WC_TEAMS = WC_TEAMS;
      window.WC_GROUPS = WC_GROUPS;
      window.WC_PLAYERS = WC_PLAYERS;
      window.WC_FIXTURES = WC_FIXTURES;
      window.WC_RESULTS = WC_RESULTS;

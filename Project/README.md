Youtube Demo "https://youtu.be/5pc8xleMF34"

My CS50 Final Project is called LoL Arena Champion Tracker. It’s a web app I built for players of League of Legends who enjoy the Arena game mode and want an easier, more visual way to track their progress. The project brings together web development, API integration, and data management into one interactive platform that balances functionality with a clean, user-friendly design.

The idea came from my own time playing League. When Arena mode was introduced — a fast-paced 2v2v2v2 format — I got hooked pretty quickly. But I noticed something missing: there wasn’t a good way to keep track of which champions I played, how well I did with them, or how my progress evolved over time. Most stat-tracking sites focus on ranked or normal games, but none paid much attention to Arena. That gap is what inspired me to create LoL Arena Champion Tracker.

Technically, the app is built with Flask for the backend, JavaScript for interactivity, and SQLite for the database. Flask handles user authentication, routing, and communication with the Riot Games API, while SQLite stores user data securely. JavaScript ties everything together on the front end, keeping the experience smooth and responsive.

When users first visit the site, they’re greeted by a simple login and registration page. I used Flask sessions and bcrypt to hash passwords, so all login data stays encrypted and secure. Once logged in, users are taken to the main dashboard — the heart of the app.

The dashboard shows a complete list of champions from the Riot API. Each one appears as a card displaying its image, name, and interactive features that let players mark progress or ownership. The overall look borrows heavily from the League of Legends interface — dark tones, gold accents, and smooth hover effects that make it feel familiar to anyone who’s played the game.

A feature I’m especially proud of is the dual search system. Players can find champions by typing their full name or just the first letter. This feature, built with JavaScript, filters results instantly without reloading the page — a small detail that makes browsing faster and more satisfying, especially with over 160 champions in the game.

The progress tracker is another key part of the project. Users can mark champions they’ve played or mastered, and that information is saved to their account through Flask and SQLite. A progress bar at the top updates in real time, showing how much of the roster a player has covered.

Under the hood, I made design choices to keep things simple but scalable. For instance, I used Flask’s Jinja templates to separate logic from layout, making the code cleaner and easier to maintain. I went with SQLite instead of a heavier database like PostgreSQL because the app doesn’t need to handle high traffic — it’s lightweight and perfect for personal use.

On the front end, I wrote custom CSS to mirror the in-game look of League. Using flexbox and grid layouts helped keep the site responsive across different screen sizes. I also focused on accessibility: font contrast, hover effects, and color balance all aim to make the interface clear and comfortable to use.

There’s even a reset progress button that lets users clear their saved data and start over. To prevent mistakes, I added a confirmation prompt. Thanks to asynchronous JavaScript, all of these interactions happen instantly without full-page reloads, keeping everything fast and smooth.

Working on this project helped me put together many of the skills I learned throughout CS50 — database design, authentication, front-end and back-end communication, and API handling. I also got hands-on experience with the Riot API, learning how to use API keys, handle rate limits, and parse JSON responses effectively.

If I expand the project in the future, I’d like to add more player statistics, like win rates, favorite champions, or average placement in Arena. I also think a leaderboard or a friend comparison system would make it more engaging. Eventually, I’d love to include Riot account login through OAuth for a seamless and secure experience.

Overall, LoL Arena Champion Tracker is more than just a school project — it’s something I genuinely wanted to exist as a player. Building it taught me how different technologies come together to create a polished, working product. It took a lot of debugging, design tweaks, and problem-solving, but seeing it all come to life was incredibly rewarding.

In the end, this project shows how Flask, JavaScript, and APIs can be combined into a single, functioning application — one that not only works but also feels purposeful. It reflects both the logic of programming and the creativity of game design, which is exactly what makes building things like this so enjoyable.

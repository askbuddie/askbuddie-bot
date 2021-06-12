<p align="center">
     <a href="https://www.askbuddie.com">
         <img "askbuddie-bot.png" align="center" alt="askbuddie-icon" width="300"/>
     </a>
</p>
<h1 align="center" style="border: 0;"> Ask Buddie Bot </h1>

Ask Buddie Bot to manage the Discord server with some useful commands and automation. This bot assists users at the time of discussion that might come handy as well as our admins / mods to moderate and automate some tasks or annoucement.

# Table Of Contents

-   [Prerequisites](#prerequisites)
-   [Contributing](#Contributing)
    -   [Contributing Guide](#Contributing-Guide)
-   [License](#license)

# Prerequisites

-   You have Node 14+ installed to align with our `tsconfig.json` for `ES2020`.
-   Fundamental knowledge of [Typescript](https://www.typescriptlang.org/docs/).

# Contributing

Want to contribute? Please check the guidelines below:

## Contributing Guide

Please use `development` branch rather than `main` for the latest development changes.

-   Fork the repository
-   Create a feature/patch branch from `development` branch
-   Commit your changes
-   push to the branch & open a pull request

If you want to add new feature to the bot, please raise an issue as well as join our [Discord Server](https://dsc.gg/askbuddie) for discussion.

## Development Setup

```
yarn install
yarn dev // for development
```

Please create a test bot application from your account & create a test server so that you can test the features. Below guide will help you to create a bot application in Discord.

-   [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

Create an `.env` file, look at the `.env.example` file for reference. Store your bot token in the `.env` file and you can begin testing the Bot in your own server. You will get the token from above step.

## License

GNU General Public License

## Overview of exercise

For this exercise we would like you to pretend you're conducting a code review. We would like you to share your screen, and verbally talk us through the comments you would make if this was a real pull request. These comments could be improvements, bugs, and even things you like and would commend the author for. The issue description and accpetance criteria are below, and they pertain to the code in the `/src` directory.

## Issue description

We would like to build a small application that showcases NASA's media (utilising their API). The media should be displayed in a gallery format, with pagination and search functionality.

## Acceptance criteria

- A server side route should exist which queries NASA's API and returns media data.
- The client / UI should consist of a gallery, each item should have:
    - A thumbnail
    - A title
    - A description
        - Fallbacks should be provided if these aren't available
- The client provides the ability to perform a search query.
- The client utilises infinite scroll for pagination to provide a continuous experience.
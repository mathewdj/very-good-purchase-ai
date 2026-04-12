# 2026-04-12 - Initial collaboration to create project
Created a simple portfolio project to demonstrate claude code skills. 

Ran the following in plan mode
```
As a senior software engineer. Create an app that can create, edit, delete and view purchases. 
- kotlin spring boot project backend
- React typescript frontend
- The purchase domain domain object is composed of amount (big decimal), description, date and purchase type

Ask me questions to clarify product requirements, technical requirements, engineering principles and constraints
```

Claude asked clarifying questions about auth, DB type, Typescript build tools and Kotlin ktor vs spring boot. I thought the clarifying questions in plan mode were great. However next time I would break down the features more because Claude struggled to get something working due to dependency hell.

I committed the baseline to git, so that I could tweak the build from here. Unfortunately docker, JDK, gradle & kotlin versions
weren't compatible when running the docker compose stack. My first instict was to bump all the incompatible tool versions to the latest but
Claude had no knowledge of spring boot 4 and thought that 3.x.x was latest.

After trial and error I was able to get something working locally. I was then able to get claude to help with getting the gradle to produce JDK 24, from a JDK 25 container.

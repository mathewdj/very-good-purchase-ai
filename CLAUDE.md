# Regarding Concise Communication
Source: https://www.aihero.dev/my-agents-md-file-for-building-plans-you-actually-read
- in all interactions and commit messages and be extremely concise and sacrifice grammar for the sake of concision.
- at the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

# Code Style
- Prefer self documenting code over adding comments to code

## kotlin code style:
- Use assertj for assertions
- Use mockk for mocking
- When writing test name use a BDD style eg `given setup, when method name called, then summary of assertions (or assertion if concise)`
- The project uses jenv to manage JDK versions. Therefore use .java-version to determine version of JDK to run tests
- Domain objects should be reused across tests. Please use a TestFixtures.kt file with a default params for domain objects
- Companion objects should be at the end of the class file

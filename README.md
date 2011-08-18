# Glitch API Playground
## Requirements:
* rvm
* ruby-1.9.2
## Setup
Verify that a new rvm gemset was created by running `rvm info`. You should see a section that looks like this:
```homes:
    gem:          "/Users/shane/.rvm/gems/ruby-1.9.2-p180@glitch"
    ruby:         "/Users/shane/.rvm/rubies/ruby-1.9.2-p180"```
If not, `cd` out of the directory and back in (`cd ..` followed by `cd -` usually works). You will be prompted to approve the rvmrc file. Type yes and hit enter to continue. Once the gemset is created bundler should install automatically. When complete, run `bundle` to install the required gems.
## Running
Run the server with `haml-server` with an optional port number using the -p flag. Then point your browser to localhost:port, where port is the port number specified or 4567 by default.

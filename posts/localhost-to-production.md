---
title: Localhost to Production
subtitle: Lessons Learned Deploying Code
date: 29-05-2024
readtime: 5 min
---

It's been 2 years since I started to learn how to build web applications, and there is a special kind of comfort in building things locally, The code works, and the frontend layout is perfect on my screen. That was my first pre-internship phase; my code always stayed peacefully on GitHub, a silent validation of how things should work.

During my first internship, I had to write code that was supposed to be deployed on the servers. The code that ran perfectly on my machine (thanks, 127.0.0.1) was pretty bad on the servers. It was a humbling experience, but it opened my eyes as a beginner to the crucial fact: **development isn't just about what works on my machine – it's about making things work consistently in different environments.**

After my internship was over I carried those lessons forward with me and embraced them.

### **The CI/CD - Continuous Integration (CI) Continuous Deployment/Delivery (CD)**

What is it? In simpler words making an environment that tests the new merge (new code addition) and if that code passes the test without any red flags then it gets staged for the deployment, and this whole process is automated the best example for beginners is GitHub Actions.

#### **Benefits of CI/CD:**

**Early Detection of Bugs:** Automated tests run on every code commit, catching issues early.

**Consistent Releases:** Frequent, smaller updates reduce the risk and complexity of big releases.

**Faster Feedback:** Devs receive immediate feedback, allowing them to address issues quickly.

**Reduced Manual Effort:** Automation minimizes the manual steps involved in integration and deployment.

#### **Setting Up a CI/CD Pipeline:**

**Version Control:** Start by using a version control system like Git. All your code changes should be committed to a shared repository (e.g., GitHub, GitLab).

**CI Configuration:** Set up a CI server to automate the build and test process. Popular tools include Jenkins, GitHub Actions, and GitLab CI/CD.

#### **Example: GitHub Actions for CI for a**`node`**project**

Create a `.github/workflows/ci.yml` file in your repository:

```yaml
name: CI Pipeline

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '21'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test
```

*This configuration runs the CI pipeline on every push, checking out the code, setting up Node.js, installing dependencies, and running tests.*

This `ci.yml` can be extended depending on the deployment environment we are working with.

### Dockerizing

Basically packing up code in a cartoon (container) box with all the dependencies and environment it requires, which makes it easy to ship/share.

Containers bundle the application code with all its dependencies, libraries, and configuration files, ensuring that the application runs consistently across different environments.

#### **Benefits of Using Docker**

**Consistency:** Docker containers ensure that your application behaves the same way in the development, testing, and production environments.

**Isolation:** Each container is isolated from others, preventing conflicts between applications.

**Portability:** Docker containers can run on any system that supports Docker (Raspberry Pi too), making it easy to move applications between environments.

**Scalability:** Docker makes it straightforward to scale applications horizontally by running multiple container instances.

#### **Getting Started with Docker**

**Installing Docker:** Before you can start using Docker, you need to install it on your local machine. Docker provides detailed installation instructions for different operating systems on its official website.

**Creating a Dockerfile:** A Dockerfile is a text file that contains instructions on how to build a Docker image. Here’s a simple example for a Next.js application:

```dockerfile
FROM node:21-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**Building the Docker Image:** With your Dockerfile ready, you can build the Docker image using the following command:

```bash
docker build -t my-next-app .
```

**Running the Container:** Once the image is built, you can run it as a container:

```bash
docker run -d -p 3000:3000 my-next-app
```

*If everything is alright then the web application will be running at localhost:3000*

### **Code for Collaboration: Writing Clear and Understandable Code**

I've come to realize that my code isn't solely for my understanding (although sometimes it feels nice that nobody else can understand what's happening here). But good code is not just for others; it makes my own life easier in the long run. Using clear variable names and comments makes my code easier to navigate, for both myself and my teammates. This makes projects more collaborative and maintainable in the long run.

#### **Principles of Writing Understandable Code**

**Descriptive Variable Names:** Instead of using cryptic abbreviations or single-letter variable names, opt for descriptive names that convey the purpose of the variable. For example:

```python
# Bad
x = 10
y = calculate(x)

# Good
number_of_items = 10
total_price = calculate_total_price(number_of_items)
```

**Meaningful Comments:** Comments should explain the intention behind complex code segments or provide context where necessary. However, strive to write self-explanatory code whenever possible.

```javascript
// Bad
// Increment counter
counter += 1;

// Good
// Increase the counter by one
counter += 1;
```

**Consistent Formatting:** Consistent formatting improves code readability and makes it easier to understand at a glance. Follow established coding conventions or style guides for the programming language you're using.

```javascript
// Inconsistent formatting
if(condition){
doSomething();
} else{
doSomethingElse();
}

// Consistent formatting
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}
```

**Modularization:** Break down complex tasks into smaller, modular functions or classes. Each function or class should have a single responsibility, making it easier to understand and maintain.

```python
# Monolithic function
def process_data(data):
    # Lengthy code here...

# Modularized functions
def clean_data(data):
    # Clean data logic...

def analyze_data(data):
    # Analyze data logic...

def visualize_data(data):
    # Visualize data logic...
```

### Conclusion

Deploying my code these past few months has opened my eyes to a whole new world. It's pushed me to think beyond the familiar local environment and see the bigger software delivery picture. This journey has also emphasised the importance of writing code that's not just functional, but also collaborative and maintainable.

So I have graduated from my GitHub comfort zone? Maybe Yes.

But, there's always A LOT left to LEARN.
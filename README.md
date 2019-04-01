## Overview

This assignment was completed with a focus on product-platform and campaign evaluations.

My initial thought when reading over this assignment was prediction algorithms and neural nets. I looked into how I might be able to feed
data into something that would spit out a grand ol' number that I would display, but I don't think it really showcases what I can do as a product engineer.
Therefore, I switched my focus around a little bit and did what I'm best at -- building product. That said, I didn't neglect the part of evaluating the ad campaign and budget
recommendations. I wanted to make sure I understood what was going on in the math and be able to explain it clearly to users of the platform. Below are all the details I considered and built.

Enjoy!

## Goals

- Focus on a simple, but powerful platform UI to allow user to make stronger product decision
  - Material UI
  - Google Analytics
- Focus on how to determine performance of campaign & come up with a good recommendation budget (relatively well)
- Don't over-engineer or build things that have been built already
  - Linear Regressions & Graph components
  - Use SPA (nextjs) because honestly I don't know much else in web-dev :)
- [Random doodles on paper](https://imgur.com/a/WFv2mz6)

## Known Issues

- Single page applications are funky and I ran into some difficulties getting redux, react, nextjs all play together nicely
- If you look into the insight details, sometimes the graph might not show; fear not, just reload the homepage and go back to where you were
- If you try refreshing on any page, you'll get basically blank because this is an SPA and I didn't set up the redirects with express yadda-yadda
  - Sorry SPAs are hard :(

## Strategies Used

### How I view an ad being successful to Sharebly
- CPI
  - While this is pretty important to keep as low as possible, I don't think this matters as much when scaling a budget
  - I only want to keep an eye on this for now; this may change in the future
- CTR
  - Pretty important for Shareably because this means we're getting a lot of traffic and potentially a lot more revenue
  - We'll mostly just use this as signal, not too much in budget calculation here
- ROI
  - The most important & easiest to use when determining scaling a budget. If an ad is giving us money, put more money in.
- Greed, greed, greed
  - Follow ROI trend more so than CTR trend

### Variables and scale numbers used

- Base increase scale factor = 0.2
- base decrease scale factor = 0.2

### Linear Regression

- Pretty straightforward (just finding a best fitting line for data points), and what I thought was a pretty good choice given the small amount of data points + time I had to code this task
- CTR & ROI were my main KPIs and further branched in CPI to help make the deciison a bit better

### Simplified Decision Tree

- ID3 Decision tree algorithm is used to predict weathers, good day to play tennis, finance, etc. I thought about using some open-source for this,
as this honestly would've been the best, but I also wanted to not deal with not knowing exactly what was going on in the algorithm
- Instead, I decided to go with my own decision tree with a 2x2 decision matrix based off the linear regression results and split off in its own sub-branches to first determine a base scale value.
- When I previously worked with facebook ads, I heavily focused on my CPM and increased my budget at roughly 25% when I "felt" that it was performing well
- In this platform's case, I want to rapidly increase the ads that are performing and **trending** well

### Budget Calculation

- See sblyScaler.js
- Naive solution
  - We pretty much take the "best" approach we can take with a heavy emphasis on ROI
  - If our ROI is trending upwards, we'll up the budget even though our avg ROI isn't that great
    - Trends are powerful and with such few data points per ad, I think this is still a good approach to go


## Other Strategies Considered & Future Implementation

If given more time, I have a couple more ideas that I believe would strongly improve this platform.
First and foremost, A/B Testing & Machine Learning. see a lot of opporuntiy to a/b test different algorithms and train neural-nets to eventually let it fully run the platform.
Secondly, with regards to using something blackbox like ML, I think visualization is super important and without knowing what decisions are being made, its hard to know if something like this could even scale
long-term. I would hone in on visualization for and really make sure that anyone can use this platform with high confidence.

- Naive Bayes Classifier
  - This classifier is a pretty strong way that could be a good way to determine a good budget price given past data
  - That said, this would require me to know when budgets were increased/decreased in the past dates and not just the spending

- ML & Neural Nets
  - Was pretty ambitious thinking this would be a cool chance to take a look into this, but I don't think I'd be able to explain what even goes on if I were to use this
  - Looked into it; saw some potential, but I felt that this was too blackbox for now
  - I think theres a lot of opportunity here for ad scalers -- feeding in images and copy to determine what ad would do well


## Links & References Used
- [Material UI](https://github.com/mui-org/material-ui)
- [NextJS](https://nextjs.org/)
- [Introduction to Decision Tree Learning: ID3](https://medium.com/machine-learning-guy/an-introduction-to-decision-tree-learning-id3-algorithm-54c74eb2ad55)
- [brainJS](https://github.com/BrainJS/brain.js)
- [Cloud Trading Algorithms](https://www.cloud9trader.com/algorithms)

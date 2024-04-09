[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/tTztJ7yI)
# Wildcard Project

You have a cool idea for an algorithms project? Use this repository. Make sure
to explain what problem you're solving, how you're doing it, and that you test
your code.

**SOLUTION**

I have been annoyed trying to keep track of what challenges I have approved/requesting changes etc... So I created a script using nodejs and github cli to fetch all repos and keep track of what challenges I have done, in progress and what feedback I have recieved.



The code is located at [my github repo here](https://github.com/tlaceby/cosc-3020). I also have pasted the main.ts file which is probably out of date unless you check the GitHub repo above. 

The output of the code produces a markdown file which looks like this:

```md
Completed 5 of 35

[x] graph-search
[ ] quicksort
[ ] reverse-insertion-sort
[ ] asymptotics
[ ] fibonacci-invariants
[ ] parallel-mergesort
[ ] dynamic-euler
[ ] pancake-sort
[ ] theoretical-sorting
[ ] recurrent-recurrences
[ ] little-o-proof
[ ] wildcard-project
[ ] tail-recursion
[ ] dijkstra-s-algorithm
[ ] detecting-cycles
[ ] brute-force-sorting
[ ] augmenting-path
[ ] asynchronous-functions
[ ] all-pairs-shortest-paths
[ ] isomorphism-connectivity
[x] graph-representations
[x] binary-search
[ ] isomorphism-nodes-connectivity
[ ] isomorphism-nodes
[ ] theory-vs-practice
[ ] quicksort-pivot
[ ] recurrence-analysis
[ ] log-o-proof
[ ] mystery-function
[x] sum
[ ] tsp-comparison
[ ] tsp-held-karp
[ ] tsp-local-search
[ ] mergesort
[x] divide-and-conquer-sum

-------------------------------   APPROVED   -------------------------------
graph-search
graph-representations
binary-search
sum
divide-and-conquer-sum

-------------------------------   CHANGES_REQUESTED   -------------------------------
brute-force-sorting  ->  How would your analysis change if you generated permutations randomly?

```

This is the current view of my completed.md file which is generated by running
```bash
npm run start check
```

It uses the gh cli tool to fetch a repo and check it's pull request status.It does this for all 35 repos which I am apart of for this class. Then it will categorize them into a helpful markdown file which I can view and have always up to date with a single command.

This script is also pretty fast as I am using async to fetch all repos status at the same time and process it concurrently. This means it's super fast and not a hastle to use like it was earlier.

Feel free to checkout the code and let me know what you think. Overall this will help me keep track of what progress I am making in this class and even better, when you approve this request I will be able to see the change update with a simple run of the command. 

Thanks.

import { spawn } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";

const repos = [
  "https://github.com/COSC3020/graph-search-tlaceby",
  "https://github.com/COSC3020/quicksort-tlaceby",
  "https://github.com/COSC3020/reverse-insertion-sort-tlaceby",
  "https://github.com/COSC3020/asymptotics-tlaceby",
  "https://github.com/COSC3020/fibonacci-invariants-tlaceby",
  "https://github.com/COSC3020/parallel-mergesort-tlaceby",
  "https://github.com/COSC3020/dynamic-euler-tlaceby",
  "https://github.com/COSC3020/pancake-sort-tlaceby",
  "https://github.com/COSC3020/theoretical-sorting-tlaceby",
  "https://github.com/COSC3020/recurrent-recurrences-tlaceby",
  "https://github.com/COSC3020/little-o-proof-tlaceby",
  "https://github.com/COSC3020/wildcard-project-tlaceby",
  "https://github.com/COSC3020/tail-recursion-tlaceby",
  "https://github.com/COSC3020/dijkstra-s-algorithm-tlaceby",
  "https://github.com/COSC3020/detecting-cycles-tlaceby",
  "https://github.com/COSC3020/brute-force-sorting-tlaceby",
  "https://github.com/COSC3020/augmenting-path-tlaceby",
  "https://github.com/COSC3020/asynchronous-functions-tlaceby",
  "https://github.com/COSC3020/all-pairs-shortest-paths-tlaceby",
  "https://github.com/COSC3020/isomorphism-connectivity-tlaceby",
  "https://github.com/COSC3020/graph-representations-tlaceby",
  "https://github.com/COSC3020/binary-search-tlaceby",
  "https://github.com/COSC3020/isomorphism-nodes-connectivity-tlaceby",
  "https://github.com/COSC3020/isomorphism-nodes-tlaceby",
  "https://github.com/COSC3020/theory-vs-practice-tlaceby",
  "https://github.com/COSC3020/quicksort-pivot-tlaceby",
  "https://github.com/COSC3020/recurrence-analysis-tlaceby",
  "https://github.com/COSC3020/log-o-proof-tlaceby",
  "https://github.com/COSC3020/mystery-function-tlaceby",
  "https://github.com/COSC3020/sum-tlaceby",
  "https://github.com/COSC3020/tsp-comparison-tlaceby",
  "https://github.com/COSC3020/tsp-held-karp-tlaceby",
  "https://github.com/COSC3020/tsp-local-search-tlaceby",
  "https://github.com/COSC3020/mergesort-tlaceby",
  "https://github.com/COSC3020/divide-and-conquer-sum-tlaceby",
];
const challenges_dir = join(__dirname, "..", "challenges");
const args = process.argv.slice(2);

if (args.length == 0 || (args[0] !== "fetch" && args[0] !== "check")) {
  console.error("Expected either (fetch | check)");
  process.exit(1);
}

if (args[0] === "fetch") {
  handle_fetch();
} else if (args[0] === "check") {
  handle_check();
}

function repoName(repo: string): string {
  return repo.split("-tlaceby")[0].split("3020/")[1];
}

interface RepoStatus {
  repo: string;
  state: "APPROVED" | "ERROR" | "N/A" | "CHANGES_REQUESTED";
  body: string;
}

async function getPullRequestReviewState(repo: string): Promise<RepoStatus> {
  return new Promise((resolve) => {
    const child = spawn("gh", [
      "pr",
      "view",
      "--json",
      "reviews",
      "--repo",
      repo,
      "1",
    ]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data;
    });

    child.stderr.on("data", (data) => {
      stderr += data;
    });

    child.on("close", (code) => {
      console.log(`Checked ${repoName(repo)}`);

      if (code !== 0) {
        resolve({ repo, state: "ERROR", body: stderr });
        return;
      }

      const reviews = JSON.parse(stdout).reviews;

      if (reviews.length === 0) {
        resolve({ repo, state: "N/A", body: "" });
        return;
      }

      const latestReview = reviews[reviews.length - 1];
      const { state, body } = latestReview;
      resolve({ repo, state, body });
    });
  });
}

async function handle_check() {
  const results: Promise<RepoStatus>[] = [];

  for (const repo of repos) {
    results.push(getPullRequestReviewState(repo));
  }

  Promise.all(results).then((results) => {
    // Generate markdown file
    let markdown = `Completed $COMPLETED of ${results.length}\n\n`;

    for (const { repo, state } of results) {
      markdown += `[${state === "APPROVED" ? "x" : " "}] ${repoName(repo)}\n`;
    }

    markdown +=
      "\n-------------------------------   APPROVED   -------------------------------\n";
    const approved = results.filter((r) => r.state === "APPROVED");
    markdown = markdown.replace("$COMPLETED", approved.length.toString());
    for (const { repo } of approved) {
      markdown += repoName(repo) + "\n";
    }

    markdown +=
      "\n-------------------------------   CHANGES_REQUESTED   -------------------------------\n";
    const changes_r = results.filter((r) => r.state === "CHANGES_REQUESTED");
    for (const { repo, body } of changes_r) {
      markdown += `${repoName(repo)}  ->  ${body}\n\n`;
    }

    markdown +=
      "\n\n-------------------------------   ERRORS   -------------------------------\n";
    for (const { repo, body } of results.filter((r) => r.state === "ERROR")) {
      markdown += `${repoName(repo)}  ->  ${body}\n`;
    }

    // Write final markdown file
    writeFileSync(join(__dirname, "..", "completed.md"), markdown);
  });
}

async function handle_fetch() {
  const dirPath = join(__dirname, args[1] ?? "");
  if (existsSync(dirPath)) {
    console.error("Please suply a valid path to create all challenges. This path must be relative to the current directory. This path should also not exist.");
    process.exit(1);
  }

  mkdirSync(dirPath);
  console.log(`Created: ${dirPath}`);

  for (const repo of repos) {
    const path = join(challenges_dir, repoName(repo));
    spawn("git", ["clone", repo, path]);
  }
}

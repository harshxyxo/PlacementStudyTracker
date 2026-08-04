package com.placementtracker.backend.config;

import com.placementtracker.backend.models.Problem;
import com.placementtracker.backend.repositories.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() == 0) {
            List<Problem> problems = Arrays.<Problem>asList(
                    // Arrays & Hashing
                    Problem.builder().title("Contains Duplicate").difficulty("Easy").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/contains-duplicate/").build(),
                    Problem.builder().title("Valid Anagram").difficulty("Easy").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/valid-anagram/").build(),
                    Problem.builder().title("Two Sum").difficulty("Easy").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/two-sum/").build(),
                    Problem.builder().title("Group Anagrams").difficulty("Medium").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/group-anagrams/").build(),
                    Problem.builder().title("Top K Frequent Elements").difficulty("Medium").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/top-k-frequent-elements/").build(),
                    Problem.builder().title("Product of Array Except Self").difficulty("Medium").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/product-of-array-except-self/").build(),
                    Problem.builder().title("Valid Sudoku").difficulty("Medium").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/valid-sudoku/").build(),
                    Problem.builder().title("Longest Consecutive Sequence").difficulty("Medium").category("Arrays & Hashing").leetcodeLink("https://leetcode.com/problems/longest-consecutive-sequence/").build(),

                    // Trees & Graphs
                    Problem.builder().title("Invert Binary Tree").difficulty("Easy").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/invert-binary-tree/").build(),
                    Problem.builder().title("Maximum Depth of Binary Tree").difficulty("Easy").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/maximum-depth-of-binary-tree/").build(),
                    Problem.builder().title("Diameter of Binary Tree").difficulty("Easy").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/diameter-of-binary-tree/").build(),
                    Problem.builder().title("Balanced Binary Tree").difficulty("Easy").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/balanced-binary-tree/").build(),
                    Problem.builder().title("Same Tree").difficulty("Easy").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/same-tree/").build(),
                    Problem.builder().title("Subtree of Another Tree").difficulty("Easy").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/subtree-of-another-tree/").build(),
                    Problem.builder().title("Lowest Common Ancestor of a BST").difficulty("Medium").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/").build(),
                    Problem.builder().title("Binary Tree Level Order Traversal").difficulty("Medium").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/binary-tree-level-order-traversal/").build(),
                    Problem.builder().title("Number of Islands").difficulty("Medium").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/number-of-islands/").build(),
                    Problem.builder().title("Clone Graph").difficulty("Medium").category("Trees & Graphs").leetcodeLink("https://leetcode.com/problems/clone-graph/").build(),

                    // Dynamic Programming
                    Problem.builder().title("Climbing Stairs").difficulty("Easy").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/climbing-stairs/").build(),
                    Problem.builder().title("Min Cost Climbing Stairs").difficulty("Easy").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/min-cost-climbing-stairs/").build(),
                    Problem.builder().title("House Robber").difficulty("Medium").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/house-robber/").build(),
                    Problem.builder().title("House Robber II").difficulty("Medium").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/house-robber-ii/").build(),
                    Problem.builder().title("Longest Palindromic Substring").difficulty("Medium").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/longest-palindromic-substring/").build(),
                    Problem.builder().title("Palindromic Substrings").difficulty("Medium").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/palindromic-substrings/").build(),
                    Problem.builder().title("Decode Ways").difficulty("Medium").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/decode-ways/").build(),
                    Problem.builder().title("Coin Change").difficulty("Medium").category("Dynamic Programming").leetcodeLink("https://leetcode.com/problems/coin-change/").build(),

                    // Sliding Window
                    Problem.builder().title("Best Time to Buy and Sell Stock").difficulty("Easy").category("Sliding Window").leetcodeLink("https://leetcode.com/problems/best-time-to-buy-and-sell-stock/").build(),
                    Problem.builder().title("Longest Substring Without Repeating Characters").difficulty("Medium").category("Sliding Window").leetcodeLink("https://leetcode.com/problems/longest-substring-without-repeating-characters/").build(),
                    Problem.builder().title("Longest Repeating Character Replacement").difficulty("Medium").category("Sliding Window").leetcodeLink("https://leetcode.com/problems/longest-repeating-character-replacement/").build(),
                    Problem.builder().title("Permutation in String").difficulty("Medium").category("Sliding Window").leetcodeLink("https://leetcode.com/problems/permutation-in-string/").build(),
                    Problem.builder().title("Minimum Window Substring").difficulty("Hard").category("Sliding Window").leetcodeLink("https://leetcode.com/problems/minimum-window-substring/").build(),
                    Problem.builder().title("Sliding Window Maximum").difficulty("Hard").category("Sliding Window").leetcodeLink("https://leetcode.com/problems/sliding-window-maximum/").build(),

                    // Binary Search
                    Problem.builder().title("Binary Search").difficulty("Easy").category("Binary Search").leetcodeLink("https://leetcode.com/problems/binary-search/").build(),
                    Problem.builder().title("Search a 2D Matrix").difficulty("Medium").category("Binary Search").leetcodeLink("https://leetcode.com/problems/search-a-2d-matrix/").build(),
                    Problem.builder().title("Koko Eating Bananas").difficulty("Medium").category("Binary Search").leetcodeLink("https://leetcode.com/problems/koko-eating-bananas/").build(),
                    Problem.builder().title("Find Minimum in Rotated Sorted Array").difficulty("Medium").category("Binary Search").leetcodeLink("https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/").build(),
                    Problem.builder().title("Search in Rotated Sorted Array").difficulty("Medium").category("Binary Search").leetcodeLink("https://leetcode.com/problems/search-in-rotated-sorted-array/").build(),
                    Problem.builder().title("Time Based Key-Value Store").difficulty("Medium").category("Binary Search").leetcodeLink("https://leetcode.com/problems/time-based-key-value-store/").build()
            );
            problemRepository.saveAll(problems);
        }
    }
}

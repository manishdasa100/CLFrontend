import { Card, CardHeader, CardBody, CardFooter, Image, Link, Button } from "@nextui-org/react"

import Card11Bg from "../assets/LearnCard11-Bg.png"

const LearnLArr = [
    {
        id: 1,
        title: "Array 101",
        description: "Get introduced with Arrays and solve some cool problems with them.",
        link: "https://leetcode.com/explore/learn/card/fun-with-arrays/",
    },
    {
        id: 2,
        title: "Dynamic Programming",
        description: "Go over the basics of DP, framework of solving DP problems, common patterns and examples.",
        link: "https://leetcode.com/explore/learn/card/dynamic-programming/",
    },
    {
        id: 3,
        title: "Graph",
        description: "Get introduced with Arrays and solve some cool problems with them.",
        link: "https://leetcode.com/explore/learn/card/graph/",
    },
    {
        id: 4,
        title: "Heap",
        description: "Have a better understanding of Heap data structure and its application.",
        link: "https://leetcode.com/explore/learn/card/heap/",
    },
    {
        id: 5,
        title: "Bit Manipulation",
        description: "Get introduced with Arrays and solve some cool problems with them.",
        link: "https://leetcode.com/explore/learn/card/bit-manipulation/",
    },
    {
        id: 6,
        title: "Sorting",
        description: "Learn sorting from ground up and understand a variety of sorting algorithms.",
        link: "https://leetcode.com/explore/learn/card/sorting/",
    },
    {
        id: 7,
        title: "Linked List",
        description: "Get introduced to another data structure called Linked List.",
        link: "https://leetcode.com/explore/learn/card/linked-list/",
    },
    {
        id: 8,
        title: "Binary Tree",
        description: "Be familiar with the concept of tree and binary tree, different traversal methods and recurssion.",
        link: "https://leetcode.com/explore/learn/card/data-structure-tree/",
    },
    {
        id: 9,
        title: "Recursion 1",
        description: "Feel confident in solving problems recursively and analyzing the complexity on your own.",
        link: "https://leetcode.com/explore/learn/card/recursion-i/",
    },
    {
        id: 10,
        title: "Recursion 2",
        description: "Dive deeper into recursion by studying some paradigms that are often applied with recursion.",
        link: "https://leetcode.com/explore/learn/card/recursion-ii/",
    },
    {
        id: 11,
        title: "Binary Search",
        description: "Get into understanding the general concept of Binary Search.",
        link: "https://leetcode.com/explore/learn/card/binary-search/",
    },
    {
        id: 12,
        title: "N-ary Tree",
        description: "Extend the concepts you have learned in binary tree to n-ary tree.",
        link: "https://leetcode.com/explore/learn/card/n-ary-tree/",
    },
    {
        id: 13,
        title: "Binary Search Tree",
        description: "Understand properties and basic operations in a Binary Search Tree.",
        link: "https://leetcode.com/explore/learn/card/introduction-to-data-structure-binary-search-tree/",
    },
    {
        id: 14,
        title: "Trie",
        description: "Go deep into implementation of Trie and how to use this data structure.",
        link: "https://leetcode.com/explore/learn/card/trie/",
    },
    {
        id: 15,
        title: "Hash Table",
        description: "Understand the principle of a Hash Table and use of hash set and hash map.",
        link: "https://leetcode.com/explore/learn/card/hash-table/",
    },
    {
        id: 16,
        title: "Array and String",
        description: "Understand basic operations and techniques applied on arrays and strings.",
        link: "https://leetcode.com/explore/learn/card/array-and-string/",
    },
    {
        id: 17,
        title: "Stack and Queue",
        description: "Learn different processing orders corresponding to linear data structures Queue and Stack.",
        link: "https://leetcode.com/explore/learn/card/queue-stack/",
    }
]

const LearnTab = () => {

    return <div className="w-[1008px] grid grid-cols-4 gap-5">
        {
            LearnLArr.map((item) => 
                <Card isFooterBlurred key={item.id} className="h-[250px]">
                    <CardHeader className="absolute z-10 top-1 flex-col items-start">
                        <p className="text-white/80 text-sm drop-shadow-md">{item.description}</p>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card example background"
                        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                        src={Card11Bg}
                    />
                    <CardFooter className="flex-col justify-between gap-3 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                        <p className="text-white font-medium text-2xl drop-shadow-lg">{item.title}</p>
                        <Button isExternal href={item.link} as={Link} showAnchorIcon className="w-full text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                            Explore
                        </Button>
                    </CardFooter>
                </Card>
            )
        } 
    </div>
}

export default LearnTab
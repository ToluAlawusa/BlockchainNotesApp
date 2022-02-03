pragma solidity ^0.5.0;

contract NoteList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;

    }
}
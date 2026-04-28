# WebSumize Log System

This page tells you how logs work in WebSumize.

## Where are logs saved?

- Logs are saved in the `C:\Users\<User>\AppData\Roaming\websumize\logs` folder.
- Each log file is named with the date, like `2020-02-27--Log`.

## When is a log made?

- A log is made when there is an error.
- The app writes the error using the function `LogWrite(message)` found in the `src/main/main.js`.

## What does a log look like?

Each log entry looks like this:

```
[YYYY-MM-DD HH:MM:SS]: (File: example.js)  <short message>

```

- The date and time are shown first.
- Messages are shortened to a max of 200 characters and line breaks are replaced with spaces (\n -> " ").
- There is a blank line after each entry.

## How does it work?

- `LogWrite(message)` writes the log.
- It ensures the log folder exists.
- It adds the message to today’s log file and shortens it.
- If the file does not exist, it creates a new one.

## Problems?

- No log file?
    - Maybe no errors occurred.
- Wrong date?
    - Check your computer’s date and time (because it uses local time).
- No log?
    - Maybe the app cannot write to the folder.

## Summary

- Logs are saved daily, only if an error occurs.
- Each log shows the time, where the error happened, and a short message hopefully explaining the error.
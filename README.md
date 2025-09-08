# What?
There are two tools in this repo. One counts characters in a string and displays them on a number line
with tick marks on the `<` and `>` characters. The other counts bytes on the same tick boundaries.
These tools are intended to be used with `llama.cpp` when debugging regexes that operate on chat template
tags.

# Getting started

This is quick and dirty, so you'll have to edit the file to change the string input. Then:

```bash
npm install
./node_modules/.bin/tsx number_line_bytes.ts
```

This should display something like:

```
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>get_time<｜tool▁sep｜>{"city": "Tokyo"}<｜tool▁call▁end｜><｜tool▁calls▁end｜>
|　                　| 　               　|        |　        　|                 |　             　| 　              　|
0　                　27　               　54       63　       　80                98　            　122　           　148
```

# Introduction

This repository handles everything related to Cardano's on-chain runtime environment: Untyped PLutus Core, abbreviated as UPLC.

This repository handles all three versions of UPLC: v1, v2 and v3.

# Directory structure

## src/builtins

Contains Javascript equivalents of all the UPLC builtins

## src/cek

Contains the stepping machine algorithm

## src/costmodel

Contains the execution budget cost calculation functions

## src/data

Contains the data-like primitives which are passed in from the off-chain environment

## src/flat

Contains decoding and encoding functions for the flat format

## src/logging

Contains basic logging structures which can be optionally passed to the stepping machine

## src/program

Contains the top node of the UPLC ast

## src/terms

Contains the other nodes of a UPLC program

## src/values

Contains the non-data-like primitives which are use to interact with the UPLC builtins

# Unit tests

Use `strictEqual` from the `node:assert` library for direct comparisons.

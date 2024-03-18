# uplc
Cardano Untyped Plutus Core javascript utility library

Responsabilities of this package:
  * deserialize UPLC into a UplcProgram
  * serialize a UplcProgram into UPLC flat 
  * evaluate a UplcProgram given certain inputs
    * async (for connecting stepping debugger)
    * sync (easier when calling from within React)
  * evaluate individual builtins syncronously (for IR optimizer)
  * partially apply inputs by wrapping a UplcProgram

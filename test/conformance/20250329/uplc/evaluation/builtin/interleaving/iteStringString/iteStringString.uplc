(program
  1.0.0
  [
    [
      [
        (force (builtin ifThenElse))
        [
          [ (builtin lessThanEqualsInteger) (con integer 11) ] (con integer 22)
        ]
      ]
      (con string "11 <= 22")
    ]
    (con string "(11 <= 22)")
  ]
)

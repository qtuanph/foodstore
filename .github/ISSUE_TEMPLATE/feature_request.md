name: "✨ Feature Request"
description: Suggest an idea or new capability for Foodstore
title: "[FEAT]: "
labels: ["enhancement"]
assignees: []

body:
  - type: markdown
    attributes:
      value: Have an idea to make Foodstore better? Tell us about it below!

  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: Is your feature request related to a problem? Please describe.
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe the solution or feature you'd like to see added.
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Describe any alternative solutions or features you've considered.

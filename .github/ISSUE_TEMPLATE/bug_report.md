name: "🐛 Bug Report"
description: Create a report to help us fix a bug
title: "[BUG]: "
labels: ["bug"]
assignees: []

body:
  - type: markdown
    attributes:
      value: Thank you for reporting a bug! Please fill out the form below.

  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is.
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps To Reproduce
      description: Steps to reproduce the behavior.
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: A clear description of what you expected to happen.
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: Error Logs / Stack Trace
      description: Paste any relevant console or API error logs here.
      render: shell

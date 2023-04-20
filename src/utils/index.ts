function steps(input: string) {
  const parseObj = input.split('\n').map((step) => {
    const subStepsPattern = /(\d+)\.\s(.+):\s([\w\s-,:]+)(.*)/
    const match = step.match(subStepsPattern)

    if (match && match.length >= 4) {
      return {
        description: match[2].trim(),
        priority: match[1].trim() === '1' ? 'high' : 'medium',
        subSteps: [
          {
            description: match[3].trim(),
            priority: match[1].trim() === '1' ? 'high' : 'medium',
          },
        ],
      }
    }

    return {
      description: step.trim(),
      priority: 'medium',
    }
  })
  return parseObj
}

export { steps }

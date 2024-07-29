import {Card, Flex, Spinner} from '@sanity/ui'

export function Filler({spinner = true}: {spinner?: boolean}) {
  return (
    <Card __unstable_checkered height="fill">
      <Flex align="center" justify="center" height="fill">
        {spinner ? <Spinner /> : null}
      </Flex>
    </Card>
  )
}

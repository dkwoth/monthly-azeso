import {useState} from 'react'
import {useCurrentUser} from 'sanity'
import {Box, Button, Card, Code, Flex, Stack, Text} from '@sanity/ui'

/**
 * 로그인한 사용자의 Sanity 계정 ID를 보여주는 Studio 도구.
 * 각 멤버가 로그인 후 자신의 ID를 복사해 member 문서의 'Sanity 계정 ID'에 붙여넣으면,
 * 새 글 작성 시 작성자가 자동으로 지정됩니다.
 */
export function WhoAmI() {
  const user = useCurrentUser()
  const [copied, setCopied] = useState(false)

  if (!user) {
    return (
      <Card padding={4}>
        <Text>로그인이 필요합니다.</Text>
      </Card>
    )
  }

  const copy = () => {
    navigator.clipboard?.writeText(user.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Box padding={4}>
      <Card padding={4} radius={3} shadow={1} style={{maxWidth: 560}}>
        <Stack space={4}>
          <Text size={3} weight="bold">
            내 Sanity 계정 정보
          </Text>
          <Text size={1} muted>
            아래 <b>계정 ID</b>를 복사해서, 멤버(member) 문서의 “Sanity 계정 ID” 칸에 붙여넣으세요. 그러면
            이 계정으로 새 후기를 만들 때 작성자가 해당 멤버로 자동 지정됩니다.
          </Text>

          <Stack space={2}>
            <Text size={1} muted>
              이름
            </Text>
            <Text>{user.name}</Text>
          </Stack>

          {user.email && (
            <Stack space={2}>
              <Text size={1} muted>
                이메일
              </Text>
              <Text>{user.email}</Text>
            </Stack>
          )}

          <Stack space={2}>
            <Text size={1} muted>
              계정 ID
            </Text>
            <Code size={1}>{user.id}</Code>
          </Stack>

          <Flex>
            <Button
              text={copied ? '복사됨!' : 'ID 복사'}
              tone="primary"
              onClick={copy}
            />
          </Flex>
        </Stack>
      </Card>
    </Box>
  )
}

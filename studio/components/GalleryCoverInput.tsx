import {useCallback} from 'react'
import {set, unset, useClient, useFormValue, type StringInputProps} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import {Card, Grid, Stack, Text} from '@sanity/ui'

type GalleryImage = {
  _key: string
  _type: 'image'
  asset?: {_ref?: string; _type?: 'reference'}
}

/**
 * 갤러리(gallery) 배열에서 대표 이미지를 시각적으로 고르는 입력 컴포넌트.
 * 선택한 갤러리 이미지의 `_key`를 문자열로 저장한다.
 * 사이트는 이 키로 갤러리에서 대표 이미지를 찾아 카드 썸네일로 사용한다.
 */
export function GalleryCoverInput(props: StringInputProps) {
  const {value, onChange} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const builder = imageUrlBuilder(client)

  // 같은 문서의 형제 필드 gallery 를 읽는다.
  const gallery = (useFormValue(['gallery']) as GalleryImage[] | undefined) ?? []

  const handleSelect = useCallback(
    (key: string) => {
      onChange(key === value ? unset() : set(key))
    },
    [onChange, value],
  )

  if (gallery.length === 0) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Text size={1}>먼저 위의 “이미지 (갤러리)”에 이미지를 추가하면 여기서 대표 이미지를 고를 수 있어요.</Text>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        갤러리 이미지 중 하나를 눌러 대표 이미지로 지정하세요.
      </Text>
      <Grid columns={[2, 3, 4]} gap={2}>
        {gallery.map((img) => {
          if (!img?.asset?._ref) return null
          const selected = img._key === value
          const src = builder.image(img).width(240).height(180).fit('crop').auto('format').url()
          return (
            <Card
              key={img._key}
              as="button"
              type="button"
              onClick={() => handleSelect(img._key)}
              padding={1}
              radius={2}
              tone={selected ? 'primary' : 'default'}
              border
              style={{
                cursor: 'pointer',
                outline: selected ? '2px solid var(--card-focus-ring-color)' : 'none',
                outlineOffset: 1,
              }}
            >
              <Stack space={2}>
                <img
                  src={src}
                  alt=""
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    borderRadius: 3,
                    opacity: selected ? 1 : 0.85,
                  }}
                />
                <Text size={0} align="center" weight={selected ? 'semibold' : 'regular'}>
                  {selected ? '✓ 대표 이미지' : '대표로 지정'}
                </Text>
              </Stack>
            </Card>
          )
        })}
      </Grid>
    </Stack>
  )
}

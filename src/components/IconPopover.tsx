import { useState } from 'react'
import { ExtendedComponentProps, ListProps, NoteProps } from '../types'
import { SlAnchor, SlBasket, SlBriefcase, SlCalender, SlCreditCard, SlCup, SlDiamond, SlDirections, SlEarphones, SlEmotsmile, SlEnergy, SlEnvolope, SlEyeglass, SlFeed, SlFilm, SlFire, SlGameController, SlGhost, SlGlobeAlt, SlGraduation, SlHandbag, SlHeart, SlHome, SlLike, SlMagicWand, SlMusicToneAlt, SlMustache, SlNotebook, SlPhone, SlPlane, SlPresent, SlQuestion, SlRocket, SlStar, SlTarget, SlTrophy, SlWallet, SlWrench } from "react-icons/sl"
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from './ui/popover'
import { IconButton } from '@chakra-ui/react'
import * as SimpleLineIcons from 'react-icons/sl'

const icons = [
  <SlBasket />,
  <SlCup />,
  <SlDiamond />,
  <SlEnergy />,
  <SlEnvolope />,
  <SlGameController />,
  <SlCreditCard />,
  <SlDirections />,
  <SlEarphones />,
  <SlEmotsmile />,
  <SlEyeglass />,
  <SlFilm />,
  <SlFeed />,
  <SlHandbag />,
  <SlHeart />,
  <SlHome />,
  <SlLike />,
  <SlGlobeAlt />,
  <SlGraduation />,
  <SlMusicToneAlt />,
  <SlPlane />,
  <SlPresent />,
  <SlStar />,
  <SlRocket />,
  <SlWallet />,
  <SlWrench />,
  <SlHome />,
  <SlMagicWand />,
  <SlPhone />,
  <SlNotebook />,
  <SlFire />,
  <SlGhost />,
  <SlMustache />,
  <SlQuestion />,
  <SlTrophy />,
  <SlTarget />,
  <SlCalender />,
  <SlAnchor />,
  <SlBriefcase />,
]
export function IconPopover({ icon = 'SlMagicWand', onChange }: ExtendedComponentProps<Partial<ListProps | NoteProps>>) {
  const [Icon, setIcon] = useState<string>(icon)
  const [open, setOpen] = useState(false)
  const handleSelect = (icon: string) => {
    setOpen(false)
    setIcon(icon)
    onChange?.({icon})
  }
  const IconComponent = (SimpleLineIcons as any)[Icon]

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <PopoverTrigger asChild>
        <IconButton
          aria-label="Icon"
          variant="ghost"
          size="md"
        >
          <IconComponent />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <PopoverTitle fontWeight="medium">Select icon</PopoverTitle>
          <div>
            {icons.map((icon, index) => (
              <IconButton
                key={index}
                aria-label="Icon"
                variant="ghost"
                size="sm"
                onClick={() => handleSelect(icon.type.name)}
              >
                {icon}
              </IconButton>
            ))}
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

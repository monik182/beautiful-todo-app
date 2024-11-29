import { useState } from 'react'
import { ExtendedComponentProps, ListProps, NoteProps } from '../types'
import { SlAnchor, SlBasket, SlBriefcase, SlCalender, SlCreditCard, SlCup, SlDiamond, SlDirections, SlEarphones, SlEmotsmile, SlEnergy, SlEnvolope, SlEyeglass, SlFeed, SlFilm, SlFire, SlGameController, SlGhost, SlGlobeAlt, SlGraduation, SlHandbag, SlHeart, SlHome, SlLike, SlMagicWand, SlMusicToneAlt, SlMustache, SlNotebook, SlPhone, SlPlane, SlPresent, SlQuestion, SlRocket, SlStar, SlTarget, SlTrophy, SlWallet, SlWrench } from "react-icons/sl"
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from './ui/popover'
import { IconButton } from '@chakra-ui/react'

const iconMapping = {
  SlBasket: <SlBasket />,
  SlCup: <SlCup />,
  SlDiamond: <SlDiamond />,
  SlEnergy: <SlEnergy />,
  SlEnvolope: <SlEnvolope />,
  SlGameController: <SlGameController />,
  SlCreditCard: <SlCreditCard />,
  SlDirections: <SlDirections />,
  SlEarphones: <SlEarphones />,
  SlEmotsmile: <SlEmotsmile />,
  SlEyeglass: <SlEyeglass />,
  SlFilm: <SlFilm />,
  SlFeed: <SlFeed />,
  SlHandbag: <SlHandbag />,
  SlHeart: <SlHeart />,
  SlHome: <SlHome />,
  SlLike: <SlLike />,
  SlGlobeAlt: <SlGlobeAlt />,
  SlGraduation: <SlGraduation />,
  SlMusicToneAlt: <SlMusicToneAlt />,
  SlPlane: <SlPlane />,
  SlPresent: <SlPresent />,
  SlStar: <SlStar />,
  SlRocket: <SlRocket />,
  SlWallet: <SlWallet />,
  SlWrench: <SlWrench />,
  SlMagicWand: <SlMagicWand />,
  SlPhone: <SlPhone />,
  SlNotebook: <SlNotebook />,
  SlFire: <SlFire />,
  SlGhost: <SlGhost />,
  SlMustache: <SlMustache />,
  SlQuestion: <SlQuestion />,
  SlTrophy: <SlTrophy />,
  SlTarget: <SlTarget />,
  SlCalender: <SlCalender />,
  SlAnchor: <SlAnchor />,
  SlBriefcase: <SlBriefcase />,
}
export function IconPopover({ icon = 'SlMagicWand', onChange }: ExtendedComponentProps<Partial<ListProps | NoteProps>>) {
  const [Icon, setIcon] = useState<string>(icon)
  const [open, setOpen] = useState(false)
  const IconComponent = Icon ? (iconMapping as any)[Icon] : null

  const handleSelect = (icon: string) => {
    setOpen(false)
    setIcon(icon)
    onChange?.({icon})
  }

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <PopoverTrigger asChild>
        <IconButton
          aria-label="Icon"
          variant="ghost"
          size="md"
        >
          {IconComponent}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <PopoverTitle fontWeight="medium">Select icon</PopoverTitle>
          <div>
            {Object.keys(iconMapping).map((icon, index) => (
              <IconButton
                key={index}
                aria-label="Icon"
                variant="ghost"
                size="sm"
                onClick={() => handleSelect(icon)}
              >
                {(iconMapping as any)[icon]}
              </IconButton>
            ))}
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

//#region Imports - Icons
import type { IconType } from 'react-icons'
import { AiOutlineCalculator, AiOutlineBarcode } from 'react-icons/ai'
import { BiUserCircle, BiSave, BiBellMinus } from 'react-icons/bi'
import {
  BsEmojiLaughing,
  BsArrowDown,
  BsArrowUpShort,
  BsQuestionCircle,
  BsBarChartLine,
  BsCalendarCheck,
  BsEmojiDizzy,
} from 'react-icons/bs'
import { CgMathPlus } from 'react-icons/cg'
import { CiPalette, CiMoneyBill } from 'react-icons/ci'
import { DiCodepen } from 'react-icons/di'
import {
  FaReact,
  FaBalanceScale,
  FaRegMoneyBillAlt,
  FaBuilding,
  FaSearch,
} from 'react-icons/fa'
import { FcPicture, FcGoogle, FcImageFile } from 'react-icons/fc'
import { GrCaretNext, GrFormPrevious, GrAdd } from 'react-icons/gr'
import { HiOutlineChartPie } from 'react-icons/hi'
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowBack,
} from 'react-icons/io'
import {
  MdExitToApp,
  MdOutlineBorderAll,
  MdAlternateEmail,
  MdDriveFileRenameOutline,
  MdOutlineCategory,
} from 'react-icons/md'
import {
  RiDeleteBin2Line,
  RiEditLine,
  RiVipCrownFill,
  RiSettings3Line,
  RiCloseLine,
  RiLockPasswordLine,
  RiStockLine,
} from 'react-icons/ri'
import { SlGraph } from 'react-icons/sl'
import {
  TbBrandSupabase,
  TbBrandBitbucket,
  TbReportAnalytics,
} from 'react-icons/tb'
//#endregion

//#region Assets
import logo from '../assets/logo.png'
//#endregion

//#region Types
export type UIVariables = {
  primaryColor: string
  secondaryColor: string
  selectorColor: string
  backgroundRgba: string

  incomeColor: string
  incomeBgColor: string
  expensesColor: string
  expensesBgColor: string
  errorColor: string
  successColor: string

  green: string
  red: string

  sidebarWidth: string
  sidebarWidthInitial: string

  smSpacing: string
  mdSpacing: string
  lgSpacing: string
  xlSpacing: string
  xxlSpacing: string

  bpmaggie: string
  bplisa: string
  bpbart: string
  bpmarge: string
  bphomer: string

  borderRadius: string
  grayBoxShadow: string

  searchIcon: IconType
  addIcon: IconType
  closeIcon: IconType
  saveIcon: IconType
  helpIcon: IconType
  crownIcon: IconType

  arrowDownIcon: IconType
  longArrowDown: IconType
  longArrowUp: IconType
  rightArrowIcon: IconType
  leftArrowIcon: IconType
  prevIcon: IconType
  nextIcon: IconType

  userIcon: IconType
  settingsIcon: IconType
  logoutIcon: IconType
  allIcon: IconType

  nameIcon: IconType
  emailIcon: IconType
  passwordIcon: IconType
  calculatorIcon: IconType

  tableEditIcon: IconType
  tableDeleteIcon: IconType
  add: IconType

  companyIcon: IconType
  categoriesIcon: IconType
  brandIcon: IconType
  internalCodeIcon: IconType
  barcodeIcon: IconType
  minStockIcon: IconType
  stockIcon: IconType

  salePriceIcon: IconType
  purchasePriceIcon: IconType
  balanceIcon: IconType

  reportsIcon: IconType
  pieChartIcon: IconType
  lineChartIcon: IconType
  barChartIcon: IconType
  checkIcon: IconType

  emptyImageIcon: IconType
  emptyPhotoIcon: IconType
  emptyEmojiIcon: IconType
  emojiIcon: IconType
  colorPaletteIcon: IconType

  supabaseIcon: IconType
  reactIcon: IconType
  googleIcon: IconType

  logo: string
}
//#endregion

//#region Variables
export const v = Object.freeze({
  primaryColor: '#F3D20C',
  secondaryColor: '#DAC1FF',
  selectorColor: '#BF94FF',
  backgroundRgba: 'rgba(210, 110, 249, 0.1)',

  incomeColor: '#53B257',
  incomeBgColor: '#e6ffe7',
  expensesColor: '#fe6156',
  expensesBgColor: '#fbcbc9',
  errorColor: '#F54E41',
  successColor: '#9046FF',

  green: '#53B257',
  red: '#F54E41',

  sidebarWidth: '300px',
  sidebarWidthInitial: '10vw',

  smSpacing: '8px',
  mdSpacing: '16px',
  lgSpacing: '24px',
  xlSpacing: '32px',
  xxlSpacing: '48px',

  bpmaggie: '15em',
  bplisa: '30em',
  bpbart: '48em',
  bpmarge: '62em',
  bphomer: '75em',

  borderRadius: '6px',
  grayBoxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',

  searchIcon: FaSearch,
  addIcon: GrAdd,
  closeIcon: RiCloseLine,
  saveIcon: BiSave,
  helpIcon: BsQuestionCircle,
  crownIcon: RiVipCrownFill,

  arrowDownIcon: IoIosArrowDown,
  longArrowDown: BsArrowDown,
  longArrowUp: BsArrowUpShort,
  rightArrowIcon: IoIosArrowForward,
  leftArrowIcon: IoIosArrowBack,
  prevIcon: GrFormPrevious,
  nextIcon: GrCaretNext,

  userIcon: BiUserCircle,
  settingsIcon: RiSettings3Line,
  logoutIcon: MdExitToApp,
  allIcon: MdOutlineBorderAll,

  nameIcon: MdDriveFileRenameOutline,
  emailIcon: MdAlternateEmail,
  passwordIcon: RiLockPasswordLine,
  calculatorIcon: AiOutlineCalculator,

  tableEditIcon: RiEditLine,
  tableDeleteIcon: RiDeleteBin2Line,
  add: CgMathPlus,

  companyIcon: FaBuilding,
  categoriesIcon: MdOutlineCategory,
  brandIcon: TbBrandBitbucket,
  internalCodeIcon: DiCodepen,
  barcodeIcon: AiOutlineBarcode,
  minStockIcon: BiBellMinus,
  stockIcon: RiStockLine,

  salePriceIcon: FaRegMoneyBillAlt,
  purchasePriceIcon: CiMoneyBill,
  balanceIcon: FaBalanceScale,

  reportsIcon: TbReportAnalytics,
  pieChartIcon: HiOutlineChartPie,
  lineChartIcon: SlGraph,
  barChartIcon: BsBarChartLine,
  checkIcon: BsCalendarCheck,

  emptyImageIcon: FcImageFile,
  emptyPhotoIcon: FcPicture,
  emptyEmojiIcon: BsEmojiDizzy,
  emojiIcon: BsEmojiLaughing,
  colorPaletteIcon: CiPalette,

  supabaseIcon: TbBrandSupabase,
  reactIcon: FaReact,
  googleIcon: FcGoogle,

  logo,
} satisfies UIVariables)
//#endregion

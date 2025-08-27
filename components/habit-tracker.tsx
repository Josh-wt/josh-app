"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { GlassCard } from "./glass-card"
import {
  Target,
  Plus,
  Flame,
  TrendingUp,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Award,
  Zap,
  Star,
  Eye,
  EyeOff,
  Timer,
  BookOpen,
  Heart,
  Brain,
  Briefcase,
  Home,
  Coffee,
  Trophy,
  Medal,
  Crown,
  Gem,
  Sparkles,
  Activity,
  LayoutGrid,
  List,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Archive,
  Search,
  Filter,
  Sort,
  Download,
  Upload,
  Share,
  Bell,
  Settings,
  Lightbulb,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  MapPin,
  Cloud,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Users,
  UserPlus,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Flag,
  AlertTriangle,
  Info,
  HelpCircle,
  Maximize2,
  Minimize2,
  Move,
  Copy,
  Scissors,
  PenTool,
  Type,
  Image,
  Video,
  FileText,
  Folder,
  FolderOpen,
  Save,
  Loader,
  RefreshCw,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Smartphone,
  Monitor,
  Headphones,
  Keyboard,
  Mouse,
  Gamepad2,
  Printer,
  Speaker,
  Bluetooth,
  Rss,
  Globe,
  Link,
  Mail,
  Phone,
  Navigation,
  Compass,
  Map,
  Route,
  Car,
  Bike,
  Footprints,
  Plane,
  Train,
  Bus,
  Truck,
  Ship,
  Anchor,
  Waves,
  Mountain,
  TreePine,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird,
  Rabbit,
  Squirrel,
  Dog,
  Cat,
  Turtle,
  Snake,
  Butterfly,
  Bee,
  Worm,
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  CreditCard,
  Banknote,
  Coins,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Package,
  Gift,
  PartyPopper,
  Cake,
  IceCream,
  Pizza,
  Utensils,
  ChefHat,
  Wine,
  GlassWater,
  Milk,
  Apple,
  Cherry,
  Grape,
  Banana,
  Orange,
  Lemon,
  Strawberry,
  Carrot,
  Salad,
  Egg,
  Croissant,
  Bread,
  Sandwich,
  Popcorn,
  Candy,
  Chocolate,
  Dumbbell,
  Weight,
  Scale,
  Ruler,
  Wrench,
  Hammer,
  Screwdriver,
  Drill,
  Saw,
  Paintbrush,
  Palette,
  Brush,
  Pen,
  Pencil,
  Eraser,
  Paperclip,
  Pin,
  Pushpin,
  Scissors as ScissorsIcon,
  Clipboard,
  Calculator,
  Calendar as CalendarIcon,
  AlarmClock,
  Stopwatch,
  Hourglass,
  Watch,
  Glasses,
  Sunglasses,
  Hat,
  Crown as CrownIcon,
  Shirt,
  Tie,
  Briefcase as BriefcaseIcon,
  Backpack,
  Luggage,
  Umbrella,
  Zap as ZapIcon,
  Flame as FlameIcon,
  Snowflake,
  Droplets,
  Wind,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Rainbow,
  Thermometer,
  Gauge,
  Radio,
  Satellite,
  Radar,
  Telescope,
  Microscope,
  Atom,
  Dna,
  Pill,
  Syringe,
  Stethoscope,
  Bandage,
  FirstAid,
  Hospital,
  Ambulance,
  Wheelchair,
  Crutches,
  Baby,
  Person,
  PersonStanding,
  Users2,
  UserCheck,
  UserMinus,
  UserX,
  Crown2,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldBan,
  AlertCircle,
  CheckCircle,
  XCircle,
  MinusCircle,
  PlusCircle,
  HelpCircle as Help,
  Navigation2,
  Send,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  MousePointer,
  MousePointer2,
  Cursor,
  Hand,
  Fingerprint as FingerPrint,
  Scan,
  QrCode,
  Barcode,
  Tag,
  Tags,
  Hash,
  AtSign,
  Percent,
  Divide,
  Minus,
  X,
  Equal,
  MoreHorizontal,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronFirst,
  ChevronLast,
  RotateCw,
  RotateCounterClockwise,
  FlipHorizontal,
  FlipVertical,
  Expand,
  Shrink,
  Maximize,
  Minimize,
  PictureInPicture,
  PictureInPicture2,
  ScanLine,
  Focus,
  Aperture,
  Camera as CameraIcon,
  Video as VideoIcon,
  Film,
  Clapperboard,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Record,
  Mic2,
  MicOff,
  Volume1,
  Volume,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Radio as RadioIcon,
  Disc,
  Disc2,
  Disc3,
  Music,
  Music2,
  Music3,
  Music4,
  Podcast,
  ListMusic,
  Library,
  Album,
  PlaySquare,
  PauseSquare,
  StopSquare,
  Forward,
  Backward,
  StepForward,
  StepBack,
  Repeat1,
  Repeat2,
  Shuffle as ShuffleIcon,
  VolumeOff,
  Vibrate,
  VibrateOff,
  Phone as PhoneIcon,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  Voicemail,
  MessageSquare,
  MessageCircle as MessageCircleIcon,
  Mail as MailIcon,
  MailOpen,
  MailPlus,
  MailMinus,
  MailX,
  MailCheck,
  Send as SendIcon,
  Inbox,
  Outbox,
  Archive as ArchiveIcon,
  Trash,
  Delete,
  Edit,
  Edit2,
  Edit3 as EditIcon,
  Feather,
  PenTool as PenToolIcon,
  Highlighter,
  Marker,
  Paintbrush2,
  Brush as BrushIcon,
  Palette as PaletteIcon,
  Pipette,
  Swatch,
  Contrast,
  Brightness,
  BrightnessDown,
  BrightnessUp,
  SunMedium,
  MoonStar,
  Sunset as SunsetIcon,
  Sunrise as SunriseIcon,
  CloudSun,
  CloudMoon,
  Cloudy,
  PartlyCloudy,
  Haze,
  Fog,
  Wind as WindIcon,
  Tornado,
  Hurricane,
  Zap2,
  BoltIcon,
  Flash,
  Flashlight,
  FlashlightOff,
  Power,
  PowerOff,
  Plug,
  Plug2,
  PlugZap,
  Battery as BatteryIcon,
  BatteryCharging,
  BatteryFull,
  BatteryHalf,
  BatteryWarning,
  Fuel,
  Gauge as GaugeIcon,
  Speedometer,
  Tachometer,
  Activity as ActivityIcon,
  Pulse,
  HeartPulse,
  Heart as HeartIcon,
  HeartOff,
  HeartCrack,
  HeartHandshake,
  Sparkle,
  Sparkles as SparklesIcon,
  Stars,
  Star as StarIcon,
  StarHalf,
  StarOff,
  Twinkle,
  Wand,
  Wand2,
  Magic,
  Magnet,
  Compass as CompassIcon,
  Navigation as NavigationIcon,
  Map as MapIcon,
  MapPin as MapPinIcon,
  Route as RouteIcon,
  Signpost,
  Milestone,
  Flag as FlagIcon,
  FlagTriangleLeft,
  FlagTriangleRight,
  Bookmark as BookmarkIcon,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkX,
  BookOpen as BookOpenIcon,
  Book,
  BookCopy,
  BookDashed,
  BookDown,
  BookImage,
  BookKey,
  BookLock,
  BookMarked,
  BookMinus,
  BookPlus,
  BookText,
  BookType,
  BookUp,
  BookUser,
  BookX,
  Library as LibraryIcon,
  GraduationCap,
  School,
  University,
  Building,
  Building2,
  Buildings,
  Factory,
  Warehouse,
  Store,
  ShoppingCenter,
  Hotel,
  Tent,
  Camping,
  Caravan,
  Castle,
  Church,
  Mosque,
  Synagogue,
  Temple,
  Pagoda,
  Torii,
  Stadium,
  Theater,
  Cinema,
  Museum,
  Bank,
  PostOffice,
  Hospital as HospitalIcon,
  Pharmacy,
  FireStation,
  PoliceStation,
  School2,
  Playground,
  ParkingCircle,
  ParkingSquare,
  Gas,
  Fuel as FuelIcon,
  ChargingStation,
  Wrench as WrenchIcon,
  Hammer as HammerIcon,
  Screwdriver as ScrewdriverIcon,
  Drill as DrillIcon,
  Saw as SawIcon,
  Axe,
  Pickaxe,
  Shovel,
  Scissors2,
  PaintBucket,
  Roller,
  Brush2,
  Pipette as PipetteIcon,
  Eyedropper,
  Ruler as RulerIcon,
  Triangle,
  Square,
  Pentagon,
  Hexagon,
  Octagon,
  Circle as CircleIcon,
  CircleDot,
  Disc as DiscIcon,
  CircleSlash,
  CircleX,
  CircleCheck,
  CirclePlus,
  CircleMinus,
  CircleArrowUp,
  CircleArrowDown,
  CircleArrowLeft,
  CircleArrowRight,
  CircleChevronUp,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronRight,
  ArrowBigUp,
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveDiagonal,
  MoveDiagonal2,
  Move3D,
  MousePointer as MousePointerIcon,
  Crosshair,
  Target as TargetIcon,
  Radar as RadarIcon,
  Satellite as SatelliteIcon,
  Telescope as TelescopeIcon,
  Microscope as MicroscopeIcon,
  Search as SearchIcon,
  Zoom,
  ZoomIn,
  ZoomOut,
  ScanEye,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Glasses as GlassesIcon,
  Sunglasses as SunglassesIcon,
  Monocle,
  Binoculars,
  Camera2,
  CameraSwitchCamera,
  Aperture as ApertureIcon,
  Focus as FocusIcon,
  Flashlight2,
  Lamp,
  LampCeiling,
  LampDesk,
  LampFloor,
  LampWallDown,
  LampWallUp,
  Lightbulb as LightbulbIcon,
  LightbulbOff,
  Candle,
  Flame2,
  Fire,
  Campfire,
  Fireplace,
  Heater,
  AirVent,
  Fan,
  Snowflake as SnowflakeIcon,
  Refrigerator,
  Microwave,
  Oven,
  ChefHat as ChefHatIcon,
  Utensils as UtensilsIcon,
  UtensilsCrossed,
  Fork,
  Knife,
  Spoon,
  Soup,
  Salad as SaladIcon,
  Pizza as PizzaIcon,
  Sandwich as SandwichIcon,
  Croissant as CroissantIcon,
  Bagel,
  Donut,
  Cookie,
  Cake as CakeIcon,
  Cupcake,
  IceCream2,
  Lollipop,
  Candy as CandyIcon,
  Popcorn as PopcornIcon,
  Pretzel,
  Beef,
  Ham,
  Drumstick,
  Fish as FishIcon,
  Shrimp,
  Egg as EggIcon,
  Milk as MilkIcon,
  Cheese,
  Bread as BreadIcon,
  Wheat,
  Rice,
  Carrot as CarrotIcon,
  Corn,
  Potato,
  Tomato,
  Onion,
  Garlic,
  Pepper,
  Chili,
  Broccoli,
  Cauliflower,
  Cabbage,
  Lettuce,
  Spinach,
  Kale,
  Apple as AppleIcon,
  Pear,
  Orange as OrangeIcon,
  Lemon as LemonIcon,
  Lime,
  Grapefruit,
  Banana as BananaIcon,
  Strawberry as StrawberryIcon,
  Blueberry,
  Raspberry,
  Blackberry,
  Cherry as CherryIcon,
  Grape as GrapeIcon,
  Watermelon,
  Melon,
  Pineapple,
  Mango,
  Peach,
  Plum,
  Kiwi,
  Coconut,
  Avocado,
  Nuts,
  Coffee as CoffeeIcon,
  Tea,
  Wine as WineIcon,
  Champagne,
  Beer,
  Cocktail,
  MartiniGlass,
  GlassWater as GlassWaterIcon,
  Bottle,
  Can,
  Jar,
  Jug,
  Thermos,
  Cup,
  Mug,
  GlassMug,
  Teapot,
  CoffeeMachine,
  Blender,
  Toaster,
  Grill,
  Barbecue,
  Scale as ScaleIcon,
  Weight as WeightIcon,
  Dumbbell as DumbbellIcon,
  Barbell,
  KettleBell,
  ResistanceBand,
  YogaMat,
  Medal as MedalIcon,
  Trophy as TrophyIcon,
  Award as AwardIcon,
  Ribbon,
  Rosette,
  Certificate,
  BadgeCheck,
  BadgeX,
  BadgePlus,
  BadgeMinus,
  BadgeDollarSign,
  BadgePercent,
  BadgeInfo,
  BadgeAlert,
  BadgeHelp,
  Crown as Crown3,
  Scepter,
  Gem as GemIcon,
  Diamond,
  Ruby,
  Emerald,
  Sapphire,
  Pearl,
  Crystal,
  RockingChair,
  Chair,
  ArmChair,
  BarChart,
  BarChart2,
  BarChart3 as BarChart3Icon,
  BarChart4,
  LineChart as LineChartIcon,
  AreaChart,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Analytics,
  Presentation,
  Monitor as MonitorIcon,
  Laptop,
  Tablet,
  Smartphone as SmartphoneIcon,
  Watch as WatchIcon,
  SmartWatch,
  Headphones2,
  Earbuds,
  Speaker2,
  Soundbar,
  Subwoofer,
  Amplifier,
  Mixer,
  Equalizer,
  Microphone,
  Microphone2,
  PodcastIcon,
  Broadcast,
  Antenna,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Bluetooth as BluetoothIcon,
  BluetoothConnected,
  BluetoothOff,
  Nfc,
  UsbPort,
  UsbCable,
  HardDrive,
  HardDriveUpload,
  HardDriveDownload,
  Database,
  DatabaseBackup,
  DatabaseImport,
  DatabaseExport,
  Cloud as CloudIcon,
  CloudUpload,
  CloudDownload,
  CloudSync,
  CloudCheck,
  CloudX,
  CloudAlert,
  CloudOff,
  Server,
  ServerCog,
  ServerCrash,
  ServerOff,
  NetworkIcon,
  Router,
  Modem,
  Globe as GlobeIcon,
  Globe2,
  Earth,
  WorldMap,
  Link as LinkIcon,
  Link2,
  LinkOff,
  Unlink,
  Unlink2,
  Chain,
  ChainBroken,
  QrCode as QrCodeIcon,
  Barcode as BarcodeIcon,
  ScanText,
  ScanFace,
  IdCard,
  CreditCard as CreditCardIcon,
  DebitCard,
  Wallet as WalletIcon,
  PiggyBank,
  Coins as CoinsIcon,
  Banknote as BanknoteIcon,
  DollarSign as DollarSignIcon,
  Euro as EuroIcon,
  PoundSterling as PoundSterlingIcon,
  Yen as YenIcon,
  IndianRupee,
  Bitcoin as BitcoinIcon,
  Ethereum,
  Litecoin,
  Dogecoin,
  TrendingUpDown,
  Stock,
  Investment,
  Calculator as CalculatorIcon,
  Abacus,
  PlusSquare,
  MinusSquare,
  XSquare,
  DivideSquare,
  EqualSquare,
  Percent as PercentIcon,
  Hash as HashIcon,
  AtSign as AtSignIcon,
  Ampersand,
  Asterisk,
  Slash,
  Backslash,
  Pipe,
  Tilde,
  Caret,
  Grave,
  Quote,
  DoubleQuote,
  Underscore,
  Hyphen,
  Dash,
  Dot,
  Comma,
  Colon,
  Semicolon,
  Exclamation,
  Question,
  Period,
  Ellipsis,
  Parentheses,
  Brackets,
  Braces,
  AngleBrackets,
  SquareBracket,
  CurlyBrace,
  RoundBracket,
  Type as TypeIcon,
  Text,
  TextCursor,
  TextSelect,
  TextQuote,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Paragraph,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  RemoveFormatting,
  FontSize,
  FontFamily,
  TextColor,
  BackgroundColor,
  Indent,
  Outdent,
  ListOrdered,
  ListUnordered,
  ListTodo,
  ListChecks,
  CheckSquare,
  Square as SquareIcon,
  Checkbox,
  CheckboxBlank,
  RadioButton,
  RadioButtonBlank,
  ToggleLeft,
  ToggleRight,
  Switch,
  Slider,
  SliderHorizontal,
  SliderVertical,
  Progress,
  ProgressBar,
  LoadingSpinner,
  Spinner,
  Hourglass as HourglassIcon,
  Timer as TimerIcon,
  Stopwatch as StopwatchIcon,
  AlarmClock as AlarmClockIcon,
  Clock as ClockIcon,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  WatchSquare,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  CalendarSearch,
  CalendarHeart,
  CalendarClock,
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarOff,
  Date,
  DateRange,
  Schedule,
  Appointment,
  Meeting,
  Event,
  Reminder,
  Notification,
  Bell as BellIcon,
  BellRing,
  BellOff,
  BellPlus,
  BellMinus,
  BellX,
  BellCheck,
  BellAlert,
  BellDot,
  Alarm,
  AlarmSmoke,
  AlertTriangle as AlertTriangleIcon,
  AlertCircle as AlertCircleIcon,
  AlertOctagon,
  AlertSquare,
  Info as InfoIcon,
  InfoSquare,
  HelpCircle as HelpCircleIcon,
  HelpSquare,
  QuestionMark,
  ExclamationMark,
  WarningTriangle,
  WarningCircle,
  WarningOctagon,
  WarningSquare,
  Error,
  ErrorCircle,
  ErrorOctagon,
  ErrorSquare,
  Success,
  SuccessCircle,
  SuccessOctagon,
  SuccessSquare,
  CheckCircle as CheckCircleIcon,
  CheckSquare as CheckSquareIcon,
  CheckOctagon,
  XCircle as XCircleIcon,
  XSquare as XSquareIcon,
  XOctagon,
  MinusCircle as MinusCircleIcon,
  MinusSquare as MinusSquareIcon,
  MinusOctagon,
  PlusCircle as PlusCircleIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  X as XIcon,
  Check,
  Checkmark,
  CrossIcon,
  TickIcon,
  ApprovalIcon,
  RejectIcon,
  AcceptIcon,
  DeclineIcon,
  ConfirmIcon,
  CancelIcon,
  OkIcon,
  YesIcon,
  NoIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Like,
  Dislike,
  Love,
  Heart2,
  HeartFilled,
  HeartEmpty,
  Favorite,
  Unfavorite,
  Star2,
  StarFilled,
  StarEmpty,
  Rating,
  Review,
  Feedback,
  Comment,
  Reply,
  Forward as ForwardIcon,
  Share as ShareIcon,
  ShareAndroid,
  ShareApple,
  Export,
  Import,
  Upload as UploadIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  FileUp,
  FileDown,
  FolderUp,
  FolderDown,
  PackageUp,
  PackageDown,
  InboxUp,
  InboxDown,
  OutboxUp,
  OutboxDown,
  ArchiveUp,
  ArchiveDown,
  File,
  Files,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  FolderClosed,
  FolderEmpty,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderEdit,
  FolderCopy,
  FolderMove,
  FolderSearch,
  FolderLock,
  FolderKey,
  FolderHeart,
  FolderStar,
  FolderBookmark,
  FolderImage,
  FolderVideo,
  FolderMusic,
  FolderText,
  FolderCode,
  FolderZip,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FilePdf,
  FileDoc,
  FileXls,
  FilePpt,
  FileZip,
  FileJson,
  FileXml,
  FileCsv,
  FileTxt,
  FileHtml,
  FileCss,
  FileJs,
  FileTs,
  FilePhp,
  FilePy,
  FileJava,
  FileCpp,
  FileCs,
  FileRb,
  FileGo,
  FileRs,
  FileSwift,
  FileKt,
  FileDart,
  FileVue,
  FileReact,
  FileAngular,
  FileSvelte,
  FileEmber,
  FileBackbone,
  FileJquery,
  FileBootstrap,
  FileTailwind,
  FileSass,
  FileLess,
  FileStyl,
  FileCoffee,
  FileMarkdown,
  FileYaml,
  FileToml,
  FileIni,
  FileConf,
  FileLog,
  FileLock,
  FileKey,
  FileShield,
  FileSecurity,
  FileWarning,
  FileError,
  FileSuccess,
  FileInfo,
  FileHelp,
  FileQuestion,
  FilePlus,
  FileMinus,
  FileX,
  FileCheck,
  FileEdit,
  FileCopy,
  FileMove,
  FileSearch,
  FileHeart,
  FileStar,
  FileBookmark,
  FilePin,
  FileFlag,
  FileTag,
  FileTime,
  FileDate,
  FileCalendar,
  FileClock,
  FileTimer,
  FileStopwatch,
  FileAlarm,
  FileBell,
  FileNotification,
  FileReminder,
  FileSchedule,
  FileAppointment,
  FileMeeting,
  FileEvent,
  FileTodo,
  FileTask,
  FileProject,
  FileGoal,
  FileTarget,
  FileObjective,
  FileMission,
  FileVision,
  FileStrategy,
  FilePlan,
  FileBlueprint,
  FileRoadmap,
  FileTimeline,
  FileMilestone,
  FileProgress,
  FileReport,
  FileAnalytics,
  FileStats,
  FileChart,
  FileGraph,
  FileDashboard,
  FilePresentation,
  FileSlide,
  FileDocument,
  FileContract,
  FileAgreement,
  FileLegal,
  FileInvoice,
  FileReceipt,
  FileBill,
  FilePayment,
  FileTransaction,
  FileFinance,
  FileBudget,
  FileExpense,
  FileIncome,
  FileProfit,
  FileLoss,
  FileBalance,
  FileAccount,
  FileBank,
  FileCredit,
  FileDebit,
  FileLoan,
  FileMortgage,
  FileInsurance,
  FileInvestment,
  FileStock,
  FileBond,
  FileFund,
  FilePortfolio,
  FileAsset,
  FileLiability,
  FileEquity,
  FileRevenue,
  FileCost,
  FileMargin,
  FileROI,
  FileKPI,
  FileMetric,
  FileBenchmark,
  FileComparison,
  FileCompetitor,
  FileMarket,
  FileIndustry,
  FileSector,
  FileEconomy,
  FileTrend,
  FileForecast,
  FilePrediction,
  FileProjection,
  FileEstimate,
  FileBudget2,
  FileQuote,
  FileProposal,
  FileBid,
  FileOffer,
  FileDeal,
  FileNegotiation,
  FileContract2,
  FileAgreement2,
  FileTerm,
  FileCondition,
  FileClause,
  FilePolicy,
  FileProcedure,
  FileProcess,
  FileWorkflow,
  FileGuide,
  FileManual,
  FileHandbook,
  FileInstruction,
  FileTutorial,
  FileTraining,
  FileEducation,
  FileLearning,
  FileKnowledge,
  FileWisdom,
  FileInsight,
  FileUnderstanding,
  FileComprehension,
  FileAwareness,
  FileConsciousness,
  FileThought,
  FileIdea,
  FileConcept,
  FileTheory,
  FileHypothesis,
  FileAssumption,
  FileProof,
  FileEvidence,
  FileData,
  FileInformation,
  FileFact,
  FileTruth,
  FileReality,
  FileExperience,
  FileMemory,
  FileHistory,
  FilePast,
  FilePresent,
  FileFuture,
  FileTime2,
  FileEternity,
  FileForever,
  FileAlways,
  FileNever,
  FileSometimes,
  FileOften,
  FileRarely,
  FileFrequently,
  FileOccasionally,
  FileRegularly,
  FilePeriodically,
  FileSchedule2,
  FileRoutine,
  FileHabit,
  FileCustom,
  FileTradition,
  FileCulture,
  FileSociety,
  FileCommunity,
  FileFamily,
  FileFriend,
  FileLove2,
  FileRelationship,
  FileConnection,
  FileBond2,
  FileTie,
  FileLink2,
  FileAssociation,
  FilePartnership,
  FileCollaboration,
  FileTeamwork,
  FileCooperation,
  FileUnity,
  FileHarmony,
  FileBalance2,
  FileEquilibrium,
  FileStability,
  FileSecurity2,
  FileSafety,
  FileProtection,
  FileDefense,
  FileGuard,
  FileShield2,
  FileArmor,
  FileBarrier,
  FileWall,
  FileFence,
  FileBoundary,
  FileLimit,
  FileRestriction,
  FileConstraint,
  FileRule,
  FileLaw,
  FileRegulation,
  FileStandard,
  FileGuideline,
  FilePrinciple,
  FileValue,
  FileBelief,
  FileFaith,
  FileTrust,
  FileConfidence,
  FileCertainty,
  FileDoubt,
  FileQuestion2,
  FileMystery,
  FileSecret,
  FileHidden,
  FilePrivate,
  FilePersonal,
  FileIntimate,
  FileConfidential,
  FileClassified,
  FileRestricted,
  FileProhibited,
  FileForbidden,
  FileBanned,
  FileBlocked,
  FileCensored,
  FileFiltered,
  FileScreened,
  FileReviewed,
  FileApproved,
  FileRejected,
  FileAccepted,
  FileDeclined,
  FileConfirmed,
  FileCanceled,
  FilePostponed,
  FileDelayed,
  FileRescheduled,
  FileUpdated,
  FileModified,
  FileChanged,
  FileAltered,
  FileRevised,
  FileEdited,
  FileImproved,
  FileEnhanced,
  FileOptimized,
  FileUpgraded,
  FileAdvanced,
  FileProfessional,
  FileExpert,
  FileMaster,
  FileChampion,
  FileWinner,
  FileSuccess2,
  FileVictory,
  FileTriumph,
  FileAchievement,
  FileAccomplishment,
  FileMilestone2,
  FileGoal2,
  FileTarget2,
  FileObjective2,
  FileMission2,
  FilePurpose,
  FileReason,
  FileCause,
  FileEffect,
  FileResult,
  FileOutcome,
  FileConsequence,
  FileImpact,
  FileInfluence,
  FilePower,
  FileStrength,
  FileForce,
  FileEnergy,
  FileMomentum,
  FileSpeed,
  FileVelocity,
  FileAcceleration,
  FileMotion,
  FileMovement,
  FileAction,
  FileActivity,
  FileBehavior,
  FileConduct,
  FilePerformance,
  FileExecution,
  FileImplementation,
  FileApplication,
  FileUsage,
  FileUtilization,
  FileEmployment,
  FileOperation,
  FileFunction,
  FileFeature,
  FileCapability,
  FileAbility,
  FileSkill,
  FileTalent,
  FileGift,
  FileBlessing,
  FileFortune,
  FileLuck,
  FileChance,
  FileOpportunity,
  FilePossibility,
  FilePotential,
  FileCapacity,
  FileRoom,
  FileSpace,
  FileArea,
  FileZone,
  FileRegion,
  FileTerritory,
  FileLand,
  FileGround,
  FileEarth2,
  FileWorld,
  FilePlanet,
  FileUniverse,
  FileCosmos,
  FileGalaxy,
  FileStar3,
  FileSun,
  FileMoon2,
  FileEarth3,
  FileVenus,
  FileMars,
  FileJupiter,
  FileSaturn,
  FileUranus,
  FileNeptune,
  FilePluto,
  FileAsteroid,
  FileComet,
  FileMeteor,
  FileBlackHole,
  FileNebula,
  FileConstellation,
  FileSolarSystem,
  FileMilkyWay,
  FileAndromeda,
  FileBigBang,
  FileInfinity,
  FileEternity2,
  FileTime3,
  FileSpace2,
  FileDimension,
  FileReality2,
  FileExistence,
  FileBeing,
  FileLife,
  FileDeath,
  FileBirth,
  FileGrowth,
  FileDevelopment,
  FileEvolution,
  FileProgress2,
  FileAdvancement,
  FileImprovement2,
  FileEnhancement,
  FileOptimization,
  FileRefinement,
  FilePerfection,
  FileExcellence,
  FileQuality,
  FileStandard2,
  FileBenchmark2,
  FileGoal3,
  FileTarget3,
  FileObjective3,
  FileMission3,
  FileVision2,
  FileDream,
  FileHope,
  FileWish,
  FileDesire,
  FileWant,
  FileNeed,
  FileRequirement,
  FileDemand,
  FileRequest,
  FileOrder,
  FileCommand,
  FileInstruction2,
  FileDirection,
  FileGuidance,
  FileAdvice,
  FileRecommendation,
  FileSuggestion,
  FileProposal2,
  FileIdea2,
  FileConcept2,
  FileThought2,
  FileNotion,
  FileOpinion,
  FileView,
  FilePerspective,
  FileAngle,
  FileApproach,
  FileMethod,
  FileTechnique,
  FileStrategy2,
  FileTactic,
  FilePlan2,
  FileScheme,
  FileDesign,
  FileBlueprint2,
  FileArchitecture,
  FileStructure,
  FileFramework,
  FileFoundation,
  FileBase,
  FilePlatform,
  FileSystem,
  FileNetwork,
  FileConnection2,
  FileLink3,
  FileBridge,
  FilePathway,
  FileRoute2,
  FileRoad,
  FileTrail,
  FileTrack,
  FilePath,
  FileJourney,
  FileTrip,
  FileVoyage,
  FileExpedition,
  FileAdventure,
  FileExploration,
  FileDiscovery,
  FileInvention,
  FileCreation,
  FileInnovation,
  FileRevolution,
  FileTransformation,
  FileChange,
  FileEvolution2,
  FileDevelopment2,
  FileGrowth2,
  FileExpansion,
  FileExtension,
  FileEnlargement,
  FileIncrease,
  FileRise,
  FileUpgrade2,
  FileImprovement3,
  FileEnhancement2,
  FileOptimization2,
  FileMaximization,
  FileAmplification,
  FileIntensification,
  FileStrengthening,
  FileReinforcement,
  FileSupport,
  FileAssistance,
  FileHelp,
  FileAid,
  FileService,
  FileFavor,
  FileBenefit,
  FileAdvantage,
  FileProfit2,
  FileGain,
  FileEarning,
  FileIncome2,
  FileRevenue2,
  FileReturn,
  FileReward,
  FilePrize,
  FileAward2,
  FileHonor,
  FileRecognition,
  FileAcknowledgment,
  FileAppreciation,
  FileGratitude,
  FileThanks,
  FileCredit2,
  FileMerit,
  FileWorth,
  FileValue2,
  FileBenefit2,
  FileImportance,
  FileSignificance,
  FileRelevance,
  FileMeaning,
  FilePurpose2,
  FileReason2,
  FileCause2,
  FileMotivation,
  FileIncentive,
  FileEncouragement,
  FileInspiration,
  FileInfluence2,
  FileImpact2,
  FileEffect2,
  FileResult2,
  FileOutcome2,
  FileConsequence2,
  FileAftermath,
  FileFollowUp,
  FileNextStep,
  FileFuture2,
  FileTomorrow,
  FileUpcoming,
  FileAnticipated,
  FileExpected,
  FilePredicted,
  FileForecast2,
  FileProjection2,
  FileEstimate2,
  FilePlan3,
  FileSchedule3,
  FileAgenda,
  FileItinerary,
  FileProgram,
  FileCurriculum,
  FileSyllabus,
  FileCourse,
  FileClass,
  FileLesson,
  FileModule,
  FileChapter,
  FileSection,
  FilePart,
  FileSegment,
  FileComponent,
  FileElement,
  FileUnit,
  FileItem,
  FilePiece,
  FileFragment,
  FileBit,
  FileParticle,
  FileAtom2,
  FileMolecule,
  FileCompound,
  FileMixture,
  FileSolution,
  FileBlend,
  FileCombination,
  FileComposition,
  FileFormula,
  FileRecipe,
  FileIngredient,
  FileComponent2,
  FileMaterial,
  FileSubstance,
  FileMatter,
  FileResource,
  FileAsset2,
  FileWealth,
  FileRiches,
  FileTreasure,
  FileJewel,
  FileDiamond2,
  FileGold,
  FileSilver,
  FilePlatinum,
  FileCopper,
  FileBronze,
  FileIron,
  FileSteel,
  FileAluminum,
  FileTitanium,
  FileCarbon,
  FileHydrogen,
  FileOxygen,
  FileNitrogen,
  FileHelium,
  FileNeon,
  FileArgon,
  FileKrypton,
  FileXenon,
  FileRadon,
  FileLithium,
  FileBeryllium,
  FileBoron,
  FileNeon2,
  FileSodium,
  FileMagnesium,
  FileAluminum2,
  FileSilicon,
  FilePhosphorus,
  FileSulfur,
  FileChlorine,
  FileCalcium,
  FilePotassium,
  FileScandium,
  FileTitanium2,
  FileVanadium,
  FileChromium,
  FileManganese,
  FileIron2,
  FileCobalt,
  FileNickel,
  FileCopper2,
  FileZinc,
  FileGallium,
  FileGermanium,
  FileArsenic,
  FileSelenium,
  FileBromine,
  FileKrypton2,
  FileRubidium,
  FileStrontium,
  FileYttrium,
  FileZirconium,
  FileNiobium,
  FileMolybdenum,
  FileTechnetium,
  FileRuthenium,
  FileRhodium,
  FilePalladium,
  FileSilver2,
  FileCadmium,
  FileIndium,
  FileTin,
  FileAntimony,
  FileTellurium,
  FileIodine,
  FileXenon2,
  FileCesium,
  FileBarium,
  FileLanthanum,
  FileCerium,
  FilePraseodymium,
  FileNeodymium,
  FilePromethium,
  FileSamarium,
  FileEuropium,
  FileGadolinium,
  FileTerbium,
  FileDysprosium,
  FileHolmium,
  FileErbium,
  FileThulium,
  FileYtterbium,
  FileLutetium,
  FileHafnium,
  FileTantalum,
  FileTungsten,
  FileRhenium,
  FileOsmium,
  FileIridium,
  FilePlatinum2,
  FileGold2,
  FileMercury,
  FileThallium,
  FileLead,
  FileBismuth,
  FilePolonium,
  FileAstatine,
  FileRadon2,
  FileFrancium,
  FileRadium,
  FileActinium,
  FileThorium,
  FileProtactinium,
  FileUranium,
  FileNeptunium,
  FilePlutonium,
  FileAmericium,
  FileCurium,
  FileBerkelium,
  FileCalifornium,
  FileEinsteinium,
  FileFermium,
  FileMendelevium,
  FileNobelium,
  FileLawrencium,
  FileRutherfordium,
  FileDubnium,
  FileSeaborgium,
  FileBohrium,
  FileHassium,
  FileMeitnerium,
  FileDarmstadtium,
  FileRoentgenium,
  FileCopernicium,
  FileNihonium,
  FileFlerovium,
  FileMoscovium,
  FileLivermorium,
  FileTennessine,
  FileOganesson
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

// Comprehensive Type Definitions
interface Habit {
  id: string
  name: string
  description?: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  current_streak: number
  best_streak: number
  total_completions: number
  target_frequency: number
  target_days: string[]
  reminder_time?: string
  color: string
  icon: string
  is_quantity_based: boolean
  target_quantity?: number
  unit?: string
  created_at: string
  updated_at: string
  user_id: string
  is_archived: boolean
  notes?: string
  priority: "low" | "medium" | "high" | "critical"
  energy_level: "low" | "medium" | "high"
  mood_impact: number // -5 to +5 scale
  tags: string[]
  location?: string
  weather_dependent: boolean
  is_social: boolean
  requires_equipment: boolean
  equipment_list?: string[]
  estimated_duration: number // in minutes
  habit_stack?: string[] // array of habit IDs this habit is stacked with
  success_criteria: string
  failure_threshold: number
  reward?: string
  penalty?: string
  motivation_quote?: string
  is_public: boolean
  mentor_id?: string
  accountability_partner?: string
  reminders_enabled: boolean
  smart_notifications: boolean
  auto_complete_conditions?: string[]
  machine_learning_suggestions: boolean
  data_visualization_type: "line" | "bar" | "pie" | "heatmap" | "scatter"
  custom_fields?: Record<string, any>
}

interface HabitCompletion {
  id: string
  habit_id: string
  completed_date: string
  quantity?: number
  notes?: string
  completion_time?: string
  mood_after?: number
  user_id: string
  created_at: string
  energy_before?: number
  energy_after?: number
  location?: string
  weather?: string
  temperature?: number
  companions?: string[]
  photos?: string[]
  voice_notes?: string[]
  satisfaction_rating?: number
  difficulty_experienced?: number
  time_taken?: number // actual time taken in minutes
  interruptions?: number
  focus_score?: number
  environment_rating?: number
  equipment_used?: string[]
  motivation_level?: number
  confidence_level?: number
  stress_level_before?: number
  stress_level_after?: number
  physical_condition?: string
  emotional_state_before?: string
  emotional_state_after?: string
  external_factors?: string[]
  completion_method?: string
  social_context?: string
  learned_insights?: string
  improvement_areas?: string[]
  celebration_method?: string
  next_action?: string
}

interface HabitStats {
  totalDays: number
  completionRate: number
  averageStreak: number
  longestStreak: number
  currentStreak: number
  weeklyProgress: number[]
  monthlyProgress: number[]
  yearlyProgress: number[]
  bestDay: string
  worstDay: string
  bestTime: string
  totalQuantity?: number
  averageQuantity?: number
  bestLocation?: string
  weatherCorrelation: Record<string, number>
  moodCorrelation: Record<number, number>
  energyPattern: number[]
  difficultyTrend: number[]
  satisfactionTrend: number[]
  timeEfficiencyTrend: number[]
  consistencyScore: number
  improvementRate: number
  predictedSuccess: number
  riskFactors: string[]
  strengthFactors: string[]
  personalizedInsights: string[]
  behaviorPatterns: Record<string, any>
  environmentalFactors: Record<string, number>
  socialInfluences: Record<string, number>
  seasonalPatterns: Record<string, number>
  weekdayPatterns: Record<string, number>
  timeOfDayPatterns: Record<string, number>
  streakDistribution: number[]
  completionTimeDistribution: number[]
  quantityDistribution?: number[]
  performanceCorrelations: Record<string, number>
  habitDependencies: string[]
  successPredictors: string[]
  failurePredictors: string[]
  optimizationSuggestions: string[]
}

interface HabitTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  target_frequency: number
  target_days: string[]
  color: string
  icon: string
  is_quantity_based: boolean
  target_quantity?: number
  unit?: string
  tags: string[]
  estimated_duration: number
  equipment_list?: string[]
  success_criteria: string
  motivation_quote: string
  tips: string[]
  common_obstacles: string[]
  solutions: string[]
  scientific_benefits: string[]
  user_rating: number
  usage_count: number
  created_by: "system" | "community" | "expert"
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  requirements: Record<string, any>
  points: number
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  category: string
  unlocked_at?: string
  progress?: number
  max_progress?: number
}

interface Challenge {
  id: string
  title: string
  description: string
  type: "individual" | "group" | "community"
  duration_days: number
  start_date: string
  end_date: string
  participants: string[]
  habits: string[]
  rules: string[]
  rewards: string[]
  leaderboard: Array<{
    user_id: string
    username: string
    score: number
    completions: number
  }>
  is_active: boolean
  created_by: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  entry_requirements?: string[]
}

interface UserProfile {
  id: string
  username: string
  email: string
  avatar_url?: string
  timezone: string
  language: string
  notification_preferences: Record<string, boolean>
  privacy_settings: Record<string, boolean>
  fitness_level: "beginner" | "intermediate" | "advanced"
  health_conditions?: string[]
  goals: string[]
  interests: string[]
  preferred_times: string[]
  available_equipment: string[]
  social_connections: string[]
  mentoring_others: string[]
  being_mentored_by?: string
  experience_points: number
  level: number
  achievements_unlocked: string[]
  badges: string[]
  streak_records: Record<string, number>
  total_completions: number
  join_date: string
  last_active: string
  subscription_type: "free" | "premium" | "pro"
  data_export_requests: string[]
  habit_insights_enabled: boolean
  ai_coaching_enabled: boolean
  social_sharing_enabled: boolean
  location_tracking_enabled: boolean
  voice_commands_enabled: boolean
  advanced_analytics_enabled: boolean
  custom_themes: Record<string, any>
  habit_templates_created: string[]
  community_contributions: number
  reputation_score: number
}

// Enhanced Category Configuration with Advanced Features
const advancedCategoryConfig = {
  health: {
    color: "from-green-400/30 to-emerald-500/30 border-green-300/40",
    darkColor: "from-green-500/40 to-emerald-600/40 border-green-400/50",
    icon: Heart,
    bgColor: "bg-green-50/80",
    textColor: "text-green-800",
    accentColor: "accent-green-500",
    gradientClasses: "bg-gradient-to-br from-green-100 via-emerald-50 to-green-100",
    subcategories: ["nutrition", "sleep", "mental-health", "medical", "wellness"],
    suggestedTimes: ["morning", "evening"],
    commonDuration: 30,
    aiInsights: "Health habits show 40% better adherence when tracked with biometric data.",
    relatedEquipment: ["fitness tracker", "scale", "blood pressure monitor"],
    expertTips: [
      "Start with micro-habits like drinking one glass of water",
      "Track energy levels to find optimal timing",
      "Combine with existing routines for better adherence"
    ]
  },
  fitness: {
    color: "from-orange-400/30 to-red-500/30 border-orange-300/40",
    darkColor: "from-orange-500/40 to-red-600/40 border-orange-400/50",
    icon: Zap,
    bgColor: "bg-orange-50/80",
    textColor: "text-orange-800",
    accentColor: "accent-orange-500",
    gradientClasses: "bg-gradient-to-br from-orange-100 via-red-50 to-orange-100",
    subcategories: ["strength", "cardio", "flexibility", "sports", "recovery"],
    suggestedTimes: ["morning", "afternoon"],
    commonDuration: 45,
    aiInsights: "Fitness habits maintain 65% higher consistency with workout partner accountability.",
    relatedEquipment: ["dumbbells", "yoga mat", "resistance bands", "jump rope"],
    expertTips: [
      "Schedule workouts like important appointments",
      "Prepare workout clothes the night before",
      "Track performance metrics beyond just completion"
    ]
  },
  productivity: {
    color: "from-blue-400/30 to-indigo-500/30 border-blue-300/40",
    darkColor: "from-blue-500/40 to-indigo-600/40 border-blue-400/50",
    icon: Briefcase,
    bgColor: "bg-blue-50/80",
    textColor: "text-blue-800",
    accentColor: "accent-blue-500",
    gradientClasses: "bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-100",
    subcategories: ["focus", "time-management", "organization", "skills", "career"],
    suggestedTimes: ["morning", "work-hours"],
    commonDuration: 25,
    aiInsights: "Productivity habits see 55% improvement with time-blocking techniques.",
    relatedEquipment: ["timer", "notebook", "computer", "productivity apps"],
    expertTips: [
      "Use the Pomodoro technique for focused work sessions",
      "Eliminate distractions during habit time",
      "Batch similar activities together"
    ]
  },
  learning: {
    color: "from-purple-400/30 to-violet-500/30 border-purple-300/40",
    darkColor: "from-purple-500/40 to-violet-600/40 border-purple-400/50",
    icon: BookOpen,
    bgColor: "bg-purple-50/80",
    textColor: "text-purple-800",
    accentColor: "accent-purple-500",
    gradientClasses: "bg-gradient-to-br from-purple-100 via-violet-50 to-purple-100",
    subcategories: ["reading", "languages", "skills", "courses", "research"],
    suggestedTimes: ["morning", "evening"],
    commonDuration: 30,
    aiInsights: "Learning habits show 70% better retention with spaced repetition scheduling.",
    relatedEquipment: ["books", "notebook", "computer", "language apps"],
    expertTips: [
      "Apply the 80/20 rule to focus on key concepts",
      "Teach others what you learn to reinforce knowledge",
      "Set specific learning goals rather than time-based ones"
    ]
  },
  mindfulness: {
    color: "from-indigo-400/30 to-blue-500/30 border-indigo-300/40",
    darkColor: "from-indigo-500/40 to-blue-600/40 border-indigo-400/50",
    icon: Brain,
    bgColor: "bg-indigo-50/80",
    textColor: "text-indigo-800",
    accentColor: "accent-indigo-500",
    gradientClasses: "bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100",
    subcategories: ["meditation", "breathing", "gratitude", "reflection", "spirituality"],
    suggestedTimes: ["morning", "evening"],
    commonDuration: 15,
    aiInsights: "Mindfulness habits reduce stress by 45% when practiced consistently for 8 weeks.",
    relatedEquipment: ["meditation cushion", "app", "journal", "timer"],
    expertTips: [
      "Start with just 2 minutes of mindful breathing",
      "Use guided meditations for beginners",
      "Create a dedicated quiet space for practice"
    ]
  },
  personal: {
    color: "from-pink-400/30 to-rose-500/30 border-pink-300/40",
    darkColor: "from-pink-500/40 to-rose-600/40 border-pink-400/50",
    icon: Home,
    bgColor: "bg-pink-50/80",
    textColor: "text-pink-800",
    accentColor: "accent-pink-500",
    gradientClasses: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100",
    subcategories: ["self-care", "hobbies", "relationships", "home", "creativity"],
    suggestedTimes: ["evening", "weekend"],
    commonDuration: 20,
    aiInsights: "Personal habits increase life satisfaction by 35% when aligned with core values.",
    relatedEquipment: ["art supplies", "tools", "books", "craft materials"],
    expertTips: [
      "Connect habits to your personal values and identity",
      "Allow flexibility in how you complete personal habits",
      "Celebrate small wins to maintain motivation"
    ]
  },
  social: {
    color: "from-cyan-400/30 to-teal-500/30 border-cyan-300/40",
    darkColor: "from-cyan-500/40 to-teal-600/40 border-cyan-400/50",
    icon: Users,
    bgColor: "bg-cyan-50/80",
    textColor: "text-cyan-800",
    accentColor: "accent-cyan-500",
    gradientClasses: "bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-100",
    subcategories: ["communication", "networking", "family", "friends", "community"],
    suggestedTimes: ["afternoon", "evening"],
    commonDuration: 30,
    aiInsights: "Social habits improve relationship quality by 60% and reduce loneliness significantly.",
    relatedEquipment: ["phone", "calendar", "gifts", "activities"],
    expertTips: [
      "Schedule regular check-ins with important people",
      "Focus on quality over quantity in social interactions",
      "Practice active listening to deepen connections"
    ]
  },
  career: {
    color: "from-slate-400/30 to-gray-500/30 border-slate-300/40",
    darkColor: "from-slate-500/40 to-gray-600/40 border-slate-400/50",
    icon: TrendingUp,
    bgColor: "bg-slate-50/80",
    textColor: "text-slate-800",
    accentColor: "accent-slate-500",
    gradientClasses: "bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100",
    subcategories: ["networking", "skill-building", "leadership", "innovation", "growth"],
    suggestedTimes: ["work-hours", "evening"],
    commonDuration: 60,
    aiInsights: "Career habits accelerate promotion timelines by 25% on average.",
    relatedEquipment: ["laptop", "courses", "books", "networking tools"],
    expertTips: [
      "Align career habits with your long-term professional goals",
      "Seek feedback regularly to adjust your approach",
      "Build both technical and soft skills systematically"
    ]
  },
  creativity: {
    color: "from-yellow-400/30 to-amber-500/30 border-yellow-300/40",
    darkColor: "from-yellow-500/40 to-amber-600/40 border-yellow-400/50",
    icon: Sparkles,
    bgColor: "bg-yellow-50/80",
    textColor: "text-yellow-800",
    accentColor: "accent-yellow-500",
    gradientClasses: "bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-100",
    subcategories: ["art", "writing", "music", "crafts", "innovation"],
    suggestedTimes: ["morning", "evening"],
    commonDuration: 45,
    aiInsights: "Creative habits boost problem-solving abilities by 50% across all life areas.",
    relatedEquipment: ["art supplies", "instruments", "writing tools", "craft materials"],
    expertTips: [
      "Embrace imperfection and focus on the process",
      "Set aside dedicated time without judgment",
      "Seek inspiration from diverse sources"
    ]
  }
}

// Enhanced Difficulty Configuration
const advancedDifficultyConfig = {
  easy: {
    color: "text-green-700",
    bg: "bg-green-100/80",
    border: "border-green-200",
    label: "Easy",
    description: "Simple daily actions",
    timeCommitment: "2-10 minutes",
    examples: ["Drink a glass of water", "Take 5 deep breaths"],
    successRate: "85-95%",
    icon: Leaf,
    multiplier: 1
  },
  medium: {
    color: "text-yellow-700",
    bg: "bg-yellow-100/80",
    border: "border-yellow-200",
    label: "Medium",
    description: "Moderate commitment required",
    timeCommitment: "10-30 minutes",
    examples: ["30-minute workout", "Read 10 pages"],
    successRate: "65-80%",
    icon: Mountain,
    multiplier: 2
  },
  hard: {
    color: "text-red-700",
    bg: "bg-red-100/80",
    border: "border-red-200",
    label: "Hard",
    description: "Significant dedication needed",
    timeCommitment: "30+ minutes",
    examples: ["Write 1000 words", "Intense workout"],
    successRate: "45-65%",
    icon: Crown,
    multiplier: 3
  },
  expert: {
    color: "text-purple-700",
    bg: "bg-purple-100/80",
    border: "border-purple-200",
    label: "Expert",
    description: "Master-level commitment",
    timeCommitment: "60+ minutes",
    examples: ["Complete certification", "Master a skill"],
    successRate: "25-45%",
    icon: Trophy,
    multiplier: 5
  }
}

// Comprehensive Achievement System
const advancedAchievementLevels = [
  // Streak Achievements
  { days: 1, icon: Sparkles, title: "First Step", color: "text-green-500", category: "streak", points: 10, description: "Completed your first habit" },
  { days: 3, icon: Star, title: "Getting Started", color: "text-blue-500", category: "streak", points: 30, description: "3-day streak achieved" },
  { days: 7, icon: Award, title: "Week Warrior", color: "text-purple-500", category: "streak", points: 100, description: "One week of consistency" },
  { days: 14, icon: Medal, title: "Fortnight Fighter", color: "text-orange-500", category: "streak", points: 250, description: "Two weeks strong" },
  { days: 30, icon: Trophy, title: "Month Master", color: "text-red-500", category: "streak", points: 500, description: "A full month of dedication" },
  { days: 60, icon: Crown, title: "Habit Hero", color: "text-indigo-500", category: "streak", points: 1000, description: "Two months of excellence" },
  { days: 100, icon: Gem, title: "Century Champion", color: "text-pink-500", category: "streak", points: 2000, description: "100 days of mastery" },
  { days: 365, icon: Diamond, title: "Year Yogi", color: "text-yellow-500", category: "streak", points: 5000, description: "A full year of transformation" },
  
  // Completion Achievements
  { completions: 10, icon: Target, title: "Starter", color: "text-gray-500", category: "completion", points: 50, description: "10 total completions" },
  { completions: 50, icon: Zap, title: "Committed", color: "text-blue-600", category: "completion", points: 200, description: "50 completions reached" },
  { completions: 100, icon: Flame, title: "Dedicated", color: "text-red-600", category: "completion", points: 500, description: "100 completions milestone" },
  { completions: 500, icon: Lightning, title: "Unstoppable", color: "text-purple-600", category: "completion", points: 2000, description: "500 completions mastered" },
  { completions: 1000, icon: Infinity, title: "Legendary", color: "text-gold-600", category: "completion", points: 5000, description: "1000 completions conquered" },
  
  // Category Mastery
  { category: "health", completions: 100, icon: Heart, title: "Health Guardian", color: "text-green-600", category: "mastery", points: 1000 },
  { category: "fitness", completions: 100, icon: Dumbbell, title: "Fitness Fanatic", color: "text-orange-600", category: "mastery", points: 1000 },
  { category: "learning", completions: 100, icon: BookOpen, title: "Knowledge Keeper", color: "text-purple-600", category: "mastery", points: 1000 },
  
  // Special Achievements
  { special: "perfect-week", icon: Star, title: "Perfect Week", color: "text-gold-500", category: "special", points: 300, description: "Completed all habits for 7 days straight" },
  { special: "early-bird", icon: Sunrise, title: "Early Bird", color: "text-yellow-600", category: "special", points: 200, description: "Completed morning habits 30 times" },
  { special: "night-owl", icon: Moon, title: "Night Owl", color: "text-indigo-600", category: "special", points: 200, description: "Completed evening habits 30 times" },
  { special: "consistency-king", icon: Crown, title: "Consistency King", color: "text-purple-700", category: "special", points: 1500, description: "Maintained 90%+ completion rate for 30 days" },
  { special: "habit-creator", icon: PlusCircle, title: "Habit Creator", color: "text-blue-700", category: "special", points: 100, description: "Created your first habit" },
  { special: "mentor", icon: Users, title: "Mentor", color: "text-green-700", category: "social", points: 500, description: "Helped 5 people with their habits" },
  { special: "team-player", icon: UserPlus, title: "Team Player", color: "text-cyan-700", category: "social", points: 300, description: "Joined 3 group challenges" }
]

// Smart Notification Templates
const intelligentNotificationTemplates = {
  reminder: {
    standard: "Time for your [HABIT_NAME]! You've got this! 💪",
    motivational: "Your future self will thank you for doing [HABIT_NAME] right now! ✨",
    streak_based: "Keep your [STREAK_LENGTH]-day streak alive with [HABIT_NAME]! 🔥",
    weather_adaptive: "Perfect [WEATHER] weather for [HABIT_NAME]! Let's make it happen! ☀️"
  },
  encouragement: {
    after_miss: "No worries! Every expert was once a beginner. Ready to get back on track with [HABIT_NAME]? 🌟",
    low_streak: "Small steps lead to big changes. Let's build that [HABIT_NAME] momentum! 🚀",
    plateau: "You've been consistent with [HABIT_NAME]! Ready to level up the challenge? 📈"
  },
  celebration: {
    streak_milestone: "🎉 Amazing! You've hit a [STREAK_LENGTH]-day streak with [HABIT_NAME]!",
    personal_best: "New personal record! Your best streak for [HABIT_NAME] is now [STREAK_LENGTH] days! 🏆",
    category_progress: "You're crushing it in [CATEGORY]! [COMPLETION_RATE]% completion rate this week! 💯"
  }
}

// Advanced Habit Templates with Scientific Backing
const scientificHabitTemplates: HabitTemplate[] = [
  {
    id: "morning-hydration",
    name: "Morning Hydration Boost",
    description: "Drink 16-20oz of water within 30 minutes of waking to kickstart metabolism and improve cognitive function",
    category: "health",
    difficulty: "easy",
    target_frequency: 7,
    target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    color: "#3b82f6",
    icon: "droplets",
    is_quantity_based: true,
    target_quantity: 16,
    unit: "oz",
    tags: ["hydration", "morning", "metabolism", "cognitive"],
    estimated_duration: 2,
    equipment_list: ["water bottle", "measuring cup"],
    success_criteria: "Drink full amount within 30 minutes of waking",
    motivation_quote: "Water is life. Start your day by honoring your body's needs.",
    tips: [
      "Keep water by your bedside table",
      "Add lemon for extra benefits and taste",
      "Use a marked water bottle to track intake"
    ],
    common_obstacles: ["Forgetting", "Not thirsty in morning", "Rushing"],
    solutions: [
      "Set water out the night before",
      "Start with smaller amounts and build up",
      "Make it part of your morning routine"
    ],
    scientific_benefits: [
      "Increases metabolic rate by 24% for 90 minutes",
      "Improves cognitive performance by 14%",
      "Reduces morning fatigue and headaches",
      "Aids in toxin elimination overnight"
    ],
    user_rating: 4.8,
    usage_count: 12547,
    created_by: "expert"
  },
  {
    id: "pomodoro-focus",
    name: "Pomodoro Deep Work Session",
    description: "25-minute focused work session followed by 5-minute break, scientifically proven to enhance productivity",
    category: "productivity",
    difficulty: "medium",
    target_frequency: 5,
    target_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    color: "#ef4444",
    icon: "timer",
    is_quantity_based: true,
    target_quantity: 2,
    unit: "sessions",
    tags: ["focus", "productivity", "time-management", "deep-work"],
    estimated_duration: 30,
    equipment_list: ["timer", "notebook", "computer"],
    success_criteria: "Complete 25 minutes without distractions",
    motivation_quote: "Focus is your superpower in a distracted world.",
    tips: [
      "Remove all distractions before starting",
      "Have a clear goal for each session",
      "Take proper breaks between sessions"
    ],
    common_obstacles: ["Distractions", "Unclear goals", "Perfectionism"],
    solutions: [
      "Use website blockers during sessions",
      "Plan tasks in advance",
      "Focus on progress, not perfection"
    ],
    scientific_benefits: [
      "Increases concentration by up to 40%",
      "Reduces mental fatigue through regular breaks",
      "Improves task completion rates by 25%",
      "Enhances creative problem-solving abilities"
    ],
    user_rating: 4.6,
    usage_count: 8932,
    created_by: "expert"
  }
  // Additional templates would be added here...
]

// AI-Powered Insight Generation
class HabitIntelligenceEngine {
  static generatePersonalizedInsights(habit: Habit, stats: HabitStats, completions: HabitCompletion[]): string[] {
    const insights: string[] = []
    
    // Performance Analysis
    if (stats.completionRate > 80) {
      insights.push(`Exceptional consistency! Your ${stats.completionRate.toFixed(0)}% completion rate puts you in the top 10% of users.`)
    } else if (stats.completionRate < 50) {
      insights.push(`Your ${stats.completionRate.toFixed(0)}% completion rate suggests this habit might need adjustment. Consider reducing difficulty or frequency.`)
    }
    
    // Timing Optimization
    const timeAnalysis = this.analyzeOptimalTiming(completions)
    if (timeAnalysis.bestTime) {
      insights.push(`Your success rate is ${timeAnalysis.improvement}% higher when you complete this habit at ${timeAnalysis.bestTime}.`)
    }
    
    // Streak Patterns
    if (stats.streakDistribution.length > 0) {
      const avgStreak = stats.streakDistribution.reduce((a, b) => a + b, 0) / stats.streakDistribution.length
      if (avgStreak > 7) {
        insights.push(`Your streak patterns show strong habit formation. Average streak length of ${avgStreak.toFixed(1)} days indicates solid neural pathway development.`)
      }
    }
    
    // Environmental Factors
    if (stats.weatherCorrelation && Object.keys(stats.weatherCorrelation).length > 0) {
      const bestWeather = Object.entries(stats.weatherCorrelation)
        .sort(([,a], [,b]) => b - a)[0]
      if (bestWeather[1] > 0.7) {
        insights.push(`You're ${(bestWeather[1] * 100).toFixed(0)}% more likely to complete this habit during ${bestWeather[0]} weather.`)
      }
    }
    
    // Mood Impact Analysis
    if (completions.length > 10) {
      const moodImpact = this.calculateMoodImpact(completions)
      if (moodImpact > 1) {
        insights.push(`This habit consistently improves your mood by an average of ${moodImpact.toFixed(1)} points post-completion.`)
      }
    }
    
    // Predictive Success Analysis
    if (stats.predictedSuccess < 0.6) {
      insights.push(`Based on current patterns, there's a ${(stats.predictedSuccess * 100).toFixed(0)}% chance of maintaining this habit long-term. Consider implementing habit stacking or reducing barriers.`)
    } else if (stats.predictedSuccess > 0.8) {
      insights.push(`Strong habit formation detected! ${(stats.predictedSuccess * 100).toFixed(0)}% probability of long-term success. Consider scaling up the challenge.`)
    }
    
    return insights
  }
  
  static analyzeOptimalTiming(completions: HabitCompletion[]) {
    const timeMap: Record<string, { count: number, successRate: number }> = {}
    
    completions.forEach(completion => {
      if (completion.completion_time) {
        const hour = new Date(`2000-01-01T${completion.completion_time}`).getHours()
        const timeRange = this.getTimeRange(hour)
        
        if (!timeMap[timeRange]) {
          timeMap[timeRange] = { count: 0, successRate: 0 }
        }
        
        timeMap[timeRange].count++
        timeMap[timeRange].successRate += completion.satisfaction_rating || 3
      }
    })
    
    let bestTime = ""
    let highestRate = 0
    
    Object.entries(timeMap).forEach(([time, data]) => {
      const avgRate = data.successRate / data.count
      if (avgRate > highestRate && data.count >= 3) {
        highestRate = avgRate
        bestTime = time
      }
    })
    
    const improvement = ((highestRate - 3) / 3) * 100 // Assuming 3 is baseline satisfaction
    
    return { bestTime, improvement: Math.max(0, improvement) }
  }
  
  static getTimeRange(hour: number): string {
    if (hour >= 5 && hour < 9) return "Early Morning"
    if (hour >= 9 && hour < 12) return "Mid Morning"
    if (hour >= 12 && hour < 15) return "Afternoon"
    if (hour >= 15 && hour < 18) return "Late Afternoon"
    if (hour >= 18 && hour < 21) return "Evening"
    return "Night"
  }
  
  static calculateMoodImpact(completions: HabitCompletion[]): number {
    const moodChanges = completions
      .filter(c => c.mood_after !== undefined)
      .map(c => (c.mood_after || 0) - 3) // Assuming 3 is neutral baseline
    
    return moodChanges.length > 0 
      ? moodChanges.reduce((a, b) => a + b, 0) / moodChanges.length 
      : 0
  }
  
  static generateOptimizationSuggestions(habit: Habit, stats: HabitStats): string[] {
    const suggestions: string[] = []
    
    // Frequency Optimization
    if (stats.completionRate < 60 && habit.target_frequency > 4) {
      suggestions.push("Consider reducing target frequency to build consistency before scaling up")
    }
    
    // Difficulty Adjustment
    if (stats.completionRate < 40 && habit.difficulty === "hard") {
      suggestions.push("Try breaking this habit into smaller, easier components")
    }
    
    // Timing Suggestions
    if (stats.weekdayPatterns) {
      const bestDays = Object.entries(stats.weekdayPatterns)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([day]) => day)
      
      suggestions.push(`Your success rate is highest on ${bestDays.join(", ")}. Consider focusing on these days initially.`)
    }
    
    // Environment Optimization
    if (stats.bestLocation) {
      suggestions.push(`You perform best when completing this habit at ${stats.bestLocation}`)
    }
    
    // Streak Recovery
    if (stats.currentStreak === 0 && stats.longestStreak > 7) {
      suggestions.push("You've done this before! Try the 2-minute rule: commit to just 2 minutes to restart your streak")
    }
    
    return suggestions
  }
}

// Enhanced Weather Integration
class WeatherAwareHabits {
  static getWeatherImpact(habit: Habit, weather: string): number {
    const weatherImpacts: Record<string, Record<string, number>> = {
      fitness: {
        sunny: 1.2,
        cloudy: 0.9,
        rainy: 0.6,
        snowy: 0.7,
        stormy: 0.4
      },
      health: {
        sunny: 1.1,
        cloudy: 1.0,
        rainy: 1.0,
        snowy: 0.9,
        stormy: 0.9
      },
      mindfulness: {
        sunny: 0.8,
        cloudy: 1.1,
        rainy: 1.3,
        snowy: 1.2,
        stormy: 0.7
      }
    }
    
    return weatherImpacts[habit.category]?.[weather] || 1.0
  }
  
  static generateWeatherBasedSuggestions(habits: Habit[], weather: string): string[] {
    const suggestions: string[] = []
    
    switch (weather) {
      case "sunny":
        suggestions.push("Perfect weather for outdoor fitness habits!")
        suggestions.push("Great day for walking or cycling habits")
        break
      case "rainy":
        suggestions.push("Ideal weather for indoor learning and mindfulness habits")
        suggestions.push("Perfect time for reading or meditation")
        break
      case "snowy":
        suggestions.push("Cozy weather for creative and personal habits")
        suggestions.push("Great time for journaling or artistic pursuits")
        break
      default:
        suggestions.push("Consistent weather for maintaining your routine habits")
    }
    
    return suggestions
  }
}

// Main Component
export function HabitTracker() {
  // Core State Management
  const [user, setUser] = useState<any>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [habitStats, setHabitStats] = useState<Record<string, HabitStats>>({})
  
  // UI State
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "calendar" | "analytics" | "social" | "challenges">("grid")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)
  const [editingCompletion, setEditingCompletion] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  
  // Advanced Filtering and Search
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // Advanced Features State
  const [darkMode, setDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true)
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false)
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(false)
  const [weatherIntegrationEnabled, setWeatherIntegrationEnabled] = useState(false)
  const [socialSharingEnabled, setSocialSharingEnabled] = useState(false)
  
  // Data Visualization State
  const [chartType, setChartType] = useState<"line" | "bar" | "pie" | "heatmap">("line")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [showPredictions, setShowPredictions] = useState(false)
  
  // Social Features State
  const [friends, setFriends] = useState<any[]>([])
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  
  // Performance State
  const [currentWeather, setCurrentWeather] = useState<string>("sunny")
  const [currentLocation, setCurrentLocation] = useState<string>("")
  const [deviceType, setDeviceType] = useState<string>("desktop")
  
  // Habit Template State
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null)
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([])
  
  // Bulk Operations State
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set())
  const [bulkActionMode, setBulkActionMode] = useState(false)
  
  // Voice and Media State
  const [isRecording, setIsRecording] = useState(false)
  const [voiceNotes, setVoiceNotes] = useState<Record<string, string[]>>({})
  const [photos, setPhotos] = useState<Record<string, string[]>>({})
  
  // Advanced New Habit State with All Features
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "health",
    difficulty: "medium" as const,
    priority: "medium" as const,
    energy_level: "medium" as const,
    mood_impact: 0,
    target_frequency: 1,
    target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    reminder_time: "",
    color: "#10b981",
    icon: "target",
    is_quantity_based: false,
    target_quantity: 1,
    unit: "",
    notes: "",
    tags: [] as string[],
    location: "",
    weather_dependent: false,
    is_social: false,
    requires_equipment: false,
    equipment_list: [] as string[],
    estimated_duration: 15,
    habit_stack: [] as string[],
    success_criteria: "",
    failure_threshold: 3,
    reward: "",
    penalty: "",
    motivation_quote: "",
    is_public: false,
    accountability_partner: "",
    reminders_enabled: true,
    smart_notifications: true,
    auto_complete_conditions: [] as string[],
    machine_learning_suggestions: true,
    data_visualization_type: "line" as const,
    custom_fields: {} as Record<string, any>
  })
  
  // Refs for Advanced Features
  const audioRecorderRef = useRef<MediaRecorder | null>(null)
  const videoStreamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Supabase Client
  const supabase = createClient()

  // Advanced Initialization
  useEffect(() => {
    const initializeAdvancedFeatures = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await Promise.all([
          fetchHabits(user),
          fetchHabitCompletions(user),
          fetchAchievements(user),
          fetchChallenges(user),
          initializeWeatherTracking(),
          initializeLocationTracking(),
          initializeVoiceCommands(),
          loadUserPreferences(user)
        ])
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    
    initializeAdvancedFeatures()
  }, [])

  // Advanced Stats Calculation with ML Insights
  useEffect(() => {
    if (habits.length > 0 && habitCompletions.length >= 0) {
      calculateAdvancedHabitStats()
    }
  }, [habits, habitCompletions])

  // Intelligent Auto-Save and Real-time Sync
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (habits.length > 0) {
        syncDataToCloud()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [habits, habitCompletions])

  // Advanced Data Fetching Functions
  const fetchHabits = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("is_archived", showArchived)
        .order("created_at", { ascending: false })

      if (error) throw error
      setHabits(data || [])
    } catch (error) {
      console.error("Error fetching habits:", error)
    }
  }

  const fetchHabitCompletions = async (currentUser = user) => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("completed_date", { ascending: false })

      if (error) throw error
      setHabitCompletions(data || [])
    } catch (error) {
      console.error("Error fetching habit completions:", error)
    }
  }

  const fetchAchievements = async (currentUser = user) => {
    if (!currentUser) return
    // Achievement fetching logic would go here
    setAchievements([])
  }

  const fetchChallenges = async (currentUser = user) => {
    if (!currentUser) return
    // Challenge fetching logic would go here
    setActiveChallenges([])
  }

  const initializeWeatherTracking = async () => {
    if (weatherIntegrationEnabled) {
      // Weather API integration would go here
      setCurrentWeather("sunny")
    }
  }

  const initializeLocationTracking = async () => {
    if (locationTrackingEnabled) {
      // Location tracking initialization would go here
      setCurrentLocation("Home")
    }
  }

  const initializeVoiceCommands = async () => {
    if (voiceCommandsEnabled) {
      // Voice command setup would go here
    }
  }

  const loadUserPreferences = async (currentUser: any) => {
    // Load user preferences from database
    // This would include theme, notification settings, etc.
  }

  const syncDataToCloud = async () => {
    // Background sync logic
    console.log("Syncing data to cloud...")
  }

  // Advanced Statistics Calculation with Machine Learning Insights
  const calculateAdvancedHabitStats = useCallback(() => {
    const stats: Record<string, HabitStats> = {}

    habits.forEach((habit) => {
      const completions = habitCompletions.filter((c) => c.habit_id === habit.id)
      const createdDate = new Date(habit.created_at)
      const today = new Date()
      const daysSinceCreated = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      // Basic Statistics
      const totalDays = completions.length
      const completionRate = daysSinceCreated > 0 ? Math.min((totalDays / daysSinceCreated) * 100, 100) : 0

      // Advanced Streak Analysis
      const streakAnalysis = calculateAdvancedStreaks(completions)
      const currentStreak = streakAnalysis.current
      const longestStreak = streakAnalysis.longest
      const streakDistribution = streakAnalysis.distribution

      // Time-based Progress Arrays
      const weeklyProgress = generateProgressArray(completions, 7)
      const monthlyProgress = generateProgressArray(completions, 30)
      const yearlyProgress = generateProgressArray(completions, 365)

      // Performance Pattern Analysis
      const timePatterns = analyzeTimePatterns(completions)
      const weekdayPatterns = analyzeWeekdayPatterns(completions)
      const seasonalPatterns = analyzeSeasonalPatterns(completions)

      // Environmental and Contextual Analysis
      const weatherCorrelation = analyzeWeatherCorrelation(completions)
      const locationAnalysis = analyzeLocationPatterns(completions)
      const moodCorrelation = analyzeMoodCorrelation(completions)

      // Advanced Metrics
      const consistencyScore = calculateConsistencyScore(completions, habit.target_frequency)
      const improvementRate = calculateImprovementRate(completions)
      const predictedSuccess = calculateSuccessPrediction(habit, completions, consistencyScore)

      // Behavioral Insights
      const behaviorPatterns = analyzeBehaviorPatterns(completions)
      const personalizedInsights = HabitIntelligenceEngine.generatePersonalizedInsights(habit, {
        totalDays,
        completionRate,
        averageStreak: longestStreak,
        longestStreak,
        currentStreak,
        weeklyProgress,
        monthlyProgress,
        yearlyProgress,
        bestDay: timePatterns.bestDay,
        worstDay: timePatterns.worstDay,
        bestTime: timePatterns.bestTime,
        totalQuantity: habit.is_quantity_based ? completions.reduce((sum, c) => sum + (c.quantity || 0), 0) : undefined,
        averageQuantity: habit.is_quantity_based ? completions.reduce((sum, c) => sum + (c.quantity || 0), 0) / completions.length : undefined,
        bestLocation: locationAnalysis.best,
        weatherCorrelation,
        moodCorrelation,
        energyPattern: generateEnergyPattern(completions),
        difficultyTrend: generateDifficultyTrend(completions),
        satisfactionTrend: generateSatisfactionTrend(completions),
        timeEfficiencyTrend: generateTimeEfficiencyTrend(completions),
        consistencyScore,
        improvementRate,
        predictedSuccess,
        riskFactors: identifyRiskFactors(habit, completions),
        strengthFactors: identifyStrengthFactors(habit, completions),
        personalizedInsights: [],
        behaviorPatterns,
        environmentalFactors: locationAnalysis.factors,
        socialInfluences: analyzeSocialInfluences(completions),
        seasonalPatterns,
        weekdayPatterns,
        timeOfDayPatterns: timePatterns.hourly,
        streakDistribution,
        completionTimeDistribution: generateCompletionTimeDistribution(completions),
        quantityDistribution: habit.is_quantity_based ? generateQuantityDistribution(completions) : undefined,
        performanceCorrelations: calculatePerformanceCorrelations(completions),
        habitDependencies: findHabitDependencies(habit, habits, habitCompletions),
        successPredictors: identifySuccessPredictors(completions),
        failurePredictors: identifyFailurePredictors(completions),
        optimizationSuggestions: HabitIntelligenceEngine.generateOptimizationSuggestions(habit, {
          totalDays,
          completionRate,
          averageStreak: longestStreak,
          longestStreak,
          currentStreak,
          weeklyProgress,
          monthlyProgress,
          yearlyProgress,
          bestDay: timePatterns.bestDay,
          worstDay: timePatterns.worstDay,
          bestTime: timePatterns.bestTime,
          weatherCorrelation,
          moodCorrelation,
          consistencyScore,
          improvementRate,
          predictedSuccess,
          weekdayPatterns,
          seasonalPatterns,
          timeOfDayPatterns: timePatterns.hourly,
          streakDistribution,
          completionTimeDistribution: generateCompletionTimeDistribution(completions),
          performanceCorrelations: calculatePerformanceCorrelations(completions),
          habitDependencies: findHabitDependencies(habit, habits, habitCompletions),
          successPredictors: identifySuccessPredictors(completions),
          failurePredictors: identifyFailurePredictors(completions),
          optimizationSuggestions: []
        })
      }, completions)

      stats[habit.id] = {
        totalDays,
        completionRate,
        averageStreak: streakAnalysis.average,
        longestStreak,
        currentStreak,
        weeklyProgress,
        monthlyProgress,
        yearlyProgress,
        bestDay: timePatterns.bestDay,
        worstDay: timePatterns.worstDay,
        bestTime: timePatterns.bestTime,
        totalQuantity: habit.is_quantity_based ? completions.reduce((sum, c) => sum + (c.quantity || 0), 0) : undefined,
        averageQuantity: habit.is_quantity_based && completions.length > 0 ? completions.reduce((sum, c) => sum + (c.quantity || 0), 0) / completions.length : undefined,
        bestLocation: locationAnalysis.best,
        weatherCorrelation,
        moodCorrelation,
        energyPattern: generateEnergyPattern(completions),
        difficultyTrend: generateDifficultyTrend(completions),
        satisfactionTrend: generateSatisfactionTrend(completions),
        timeEfficiencyTrend: generateTimeEfficiencyTrend(completions),
        consistencyScore,
        improvementRate,
        predictedSuccess,
        riskFactors: identifyRiskFactors(habit, completions),
        strengthFactors: identifyStrengthFactors(habit, completions),
        personalizedInsights,
        behaviorPatterns,
        environmentalFactors: locationAnalysis.factors,
        socialInfluences: analyzeSocialInfluences(completions),
        seasonalPatterns,
        weekdayPatterns,
        timeOfDayPatterns: timePatterns.hourly,
        streakDistribution,
        completionTimeDistribution: generateCompletionTimeDistribution(completions),
        quantityDistribution: habit.is_quantity_based ? generateQuantityDistribution(completions) : undefined,
        performanceCorrelations: calculatePerformanceCorrelations(completions),
        habitDependencies: findHabitDependencies(habit, habits, habitCompletions),
        successPredictors: identifySuccessPredictors(completions),
        failurePredictors: identifyFailurePredictors(completions),
        optimizationSuggestions: HabitIntelligenceEngine.generateOptimizationSuggestions(habit, {
          totalDays,
          completionRate,
          averageStreak: longestStreak,
          longestStreak,
          currentStreak,
          weeklyProgress,
          monthlyProgress,
          yearlyProgress,
          bestDay: timePatterns.bestDay,
          worstDay: timePatterns.worstDay,
          bestTime: timePatterns.bestTime,
          weatherCorrelation,
          moodCorrelation,
          consistencyScore,
          improvementRate,
          predictedSuccess,
          weekdayPatterns,
          seasonalPatterns,
          timeOfDayPatterns: timePatterns.hourly,
          streakDistribution,
          completionTimeDistribution: generateCompletionTimeDistribution(completions),
          performanceCorrelations: calculatePerformanceCorrelations(completions),
          habitDependencies: findHabitDependencies(habit, habits, habitCompletions),
          successPredictors: identifySuccessPredictors(completions),
          failurePredictors: identifyFailurePredictors(completions),
          optimizationSuggestions: []
        })
      }
    })

    setHabitStats(stats)
  }, [habits, habitCompletions])

  // Advanced Analytics Helper Functions
  const calculateAdvancedStreaks = (completions: HabitCompletion[]) => {
    const sortedDates = completions
      .map(c => c.completed_date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (sortedDates.length === 0) {
      return { current: 0, longest: 0, average: 0, distribution: [] }
    }

    let currentStreak = 0
    let longestStreak = 0
    let currentCount = 0
    const streaks: number[] = []
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Calculate current streak
    if (sortedDates.includes(today)) {
      currentStreak = 1
      let checkDate = new Date(Date.now() - 86400000)
      while (sortedDates.includes(checkDate.toISOString().split('T')[0])) {
        currentStreak++
        checkDate = new Date(checkDate.getTime() - 86400000)
      }
    } else if (sortedDates.includes(yesterday)) {
      let checkDate = new Date(Date.now() - 86400000)
      while (sortedDates.includes(checkDate.toISOString().split('T')[0])) {
        currentStreak++
        checkDate = new Date(checkDate.getTime() - 86400000)
      }
    }

    // Calculate all streaks for distribution analysis
    const allDates = sortedDates.sort()
    let tempStreak = 1

    for (let i = 1; i < allDates.length; i++) {
      const prevDate = new Date(allDates[i - 1])
      const currDate = new Date(allDates[i])
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        tempStreak++
      } else {
        streaks.push(tempStreak)
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    
    streaks.push(tempStreak)
    longestStreak = Math.max(longestStreak, tempStreak)

    const averageStreak = streaks.length > 0 ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0

    return {
      current: currentStreak,
      longest: longestStreak,
      average: averageStreak,
      distribution: streaks
    }
  }

  const generateProgressArray = (completions: HabitCompletion[], days: number) => {
    const today = new Date()
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today.getTime() - (days - 1 - i) * 86400000)
      const dateString = date.toISOString().split('T')[0]
      return completions.some(c => c.completed_date === dateString) ? 1 : 0
    })
  }

  const analyzeTimePatterns = (completions: HabitCompletion[]) => {
    const dayCount: Record<string, number> = {}
    const timeCount: Record<number, number> = {}
    const hourlyCount: Record<string, number> = {}

    completions.forEach(completion => {
      // Day of week analysis
      const dayOfWeek = new Date(completion.completed_date).toLocaleDateString('en-US', { weekday: 'long' })
      dayCount[dayOfWeek] = (dayCount[dayOfWeek] || 0) + 1

      // Time of day analysis
      if (completion.completion_time) {
        const hour = new Date(`2000-01-01T${completion.completion_time}`).getHours()
        timeCount[hour] = (timeCount[hour] || 0) + 1
        
        const timeRange = getDetailedTimeRange(hour)
        hourlyCount[timeRange] = (hourlyCount[timeRange] || 0) + 1
      }
    })

    const bestDay = Object.entries(dayCount).reduce((a, b) => dayCount[a[0]] > dayCount[b[0]] ? a : b, ['Monday', 0])[0]
    const worstDay = Object.entries(dayCount).reduce((a, b) => dayCount[a[0]] < dayCount[b[0]] ? a : b, ['Monday', 0])[0]
    const bestHour = Object.entries(timeCount).reduce((a, b) => timeCount[parseInt(a[0])] > timeCount[parseInt(b[0])] ? a : b, ['9', 0])
    const bestTime = bestHour ? getDetailedTimeRange(parseInt(bestHour[0])) : 'Morning'

    return {
      bestDay,
      worstDay,
      bestTime,
      hourly: hourlyCount,
      daily: dayCount
    }
  }

  const getDetailedTimeRange = (hour: number): string => {
    if (hour >= 5 && hour < 8) return 'Early Morning'
    if (hour >= 8 && hour < 11) return 'Morning'
    if (hour >= 11 && hour < 14) return 'Midday'
    if (hour >= 14 && hour < 17) return 'Afternoon'
    if (hour >= 17 && hour < 20) return 'Evening'
    if (hour >= 20 && hour < 23) return 'Night'
    return 'Late Night'
  }

  const analyzeWeekdayPatterns = (completions: HabitCompletion[]) => {
    const patterns: Record<string, number> = {}
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    days.forEach(day => patterns[day] = 0)
    
    completions.forEach(completion => {
      const dayOfWeek = new Date(completion.completed_date).toLocaleDateString('en-US', { weekday: 'long' })
      patterns[dayOfWeek]++
    })
    
    return patterns
  }

  const analyzeSeasonalPatterns = (completions: HabitCompletion[]) => {
    const patterns: Record<string, number> = {
      'Spring': 0,
      'Summer': 0,
      'Fall': 0,
      'Winter': 0
    }
    
    completions.forEach(completion => {
      const date = new Date(completion.completed_date)
      const month = date.getMonth()
      
      if (month >= 2 && month <= 4) patterns['Spring']++
      else if (month >= 5 && month <= 7) patterns['Summer']++
      else if (month >= 8 && month <= 10) patterns['Fall']++
      else patterns['Winter']++
    })
    
    return patterns
  }

  const analyzeWeatherCorrelation = (completions: HabitCompletion[]) => {
    const weatherData: Record<string, number> = {}
    
    completions.forEach(completion => {
      if (completion.weather) {
        weatherData[completion.weather] = (weatherData[completion.weather] || 0) + 1
      }
    })
    
    return weatherData
  }

  const analyzeLocationPatterns = (completions: HabitCompletion[]) => {
    const locationData: Record<string, number> = {}
    
    completions.forEach(completion => {
      if (completion.location) {
        locationData[completion.location] = (locationData[completion.location] || 0) + 1
      }
    })
    
    const best = Object.entries(locationData).reduce((a, b) => locationData[a[0]] > locationData[b[0]] ? a : b, ['Home', 0])[0]
    
    return {
      best,
      factors: locationData
    }
  }

  const analyzeMoodCorrelation = (completions: HabitCompletion[]) => {
    const moodData: Record<number, number> = {}
    
    completions.forEach(completion => {
      if (completion.mood_after !== undefined) {
        const mood = completion.mood_after
        moodData[mood] = (moodData[mood] || 0) + 1
      }
    })
    
    return moodData
  }

  const calculateConsistencyScore = (completions: HabitCompletion[], targetFrequency: number): number => {
    if (completions.length === 0) return 0
    
    const weeksOfData = Math.ceil(completions.length / 7)
    const expectedCompletions = weeksOfData * targetFrequency
    const actualCompletions = completions.length
    
    const rawScore = Math.min((actualCompletions / expectedCompletions), 1) * 100
    
    // Bonus for recent consistency
    const recentCompletions = completions.filter(c => {
      const completionDate = new Date(c.completed_date)
      const daysAgo = (Date.now() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 14
    })
    
    const recentBonus = (recentCompletions.length / Math.min(14, targetFrequency * 2)) * 10
    
    return Math.min(rawScore + recentBonus, 100)
  }

  const calculateImprovementRate = (completions: HabitCompletion[]): number => {
    if (completions.length < 4) return 0
    
    const sortedCompletions = completions.sort((a, b) => 
      new Date(a.completed_date).getTime() - new Date(b.completed_date).getTime()
    )
    
    const firstHalf = sortedCompletions.slice(0, Math.floor(sortedCompletions.length / 2))
    const secondHalf = sortedCompletions.slice(Math.floor(sortedCompletions.length / 2))
    
    const firstHalfRate = firstHalf.reduce((sum, c) => sum + (c.satisfaction_rating || 3), 0) / firstHalf.length
    const secondHalfRate = secondHalf.reduce((sum, c) => sum + (c.satisfaction_rating || 3), 0) / secondHalf.length
    
    return ((secondHalfRate - firstHalfRate) / firstHalfRate) * 100
  }

  const calculateSuccessPrediction = (habit: Habit, completions: HabitCompletion[], consistencyScore: number): number => {
    let score = consistencyScore / 100
    
    // Factor in difficulty adjustment
    const difficultyMultiplier = {
      'easy': 1.2,
      'medium': 1.0,
      'hard': 0.8,
      'expert': 0.6
    }[habit.difficulty] || 1.0
    
    score *= difficultyMultiplier
    
    // Factor in streak stability
    const streakAnalysis = calculateAdvancedStreaks(completions)
    if (streakAnalysis.average > 3) {
      score *= 1.1
    }
    
    // Factor in recency
    const recentCompletions = completions.filter(c => {
      const daysAgo = (Date.now() - new Date(c.completed_date).getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 7
    })
    
    if (recentCompletions.length >= habit.target_frequency) {
      score *= 1.15
    } else if (recentCompletions.length === 0) {
      score *= 0.7
    }
    
    return Math.min(Math.max(score, 0), 1)
  }

  const generateEnergyPattern = (completions: HabitCompletion[]): number[] => {
    return completions.map(c => c.energy_after || c.energy_before || 3)
  }

  const generateDifficultyTrend = (completions: HabitCompletion[]): number[] => {
    return completions.map(c => c.difficulty_experienced || 3)
  }

  const generateSatisfactionTrend = (completions: HabitCompletion[]): number[] => {
    return completions.map(c => c.satisfaction_rating || 3)
  }

  const generateTimeEfficiencyTrend = (completions: HabitCompletion[]): number[] => {
    return completions.map(c => {
      if (c.time_taken && c.time_taken > 0) {
        // Return efficiency score (lower time_taken = higher efficiency)
        return Math.max(1, 5 - (c.time_taken / 10))
      }
      return 3
    })
  }

  const identifyRiskFactors = (habit: Habit, completions: HabitCompletion[]): string[] => {
    const factors: string[] = []
    
    if (habit.difficulty === 'hard' || habit.difficulty === 'expert') {
      factors.push('High difficulty level may lead to burnout')
    }
    
    if (habit.target_frequency > 5) {
      factors.push('Very high frequency target may be unsustainable')
    }
    
    const recentCompletions = completions.filter(c => {
      const daysAgo = (Date.now() - new Date(c.completed_date).getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 7
    })
    
    if (recentCompletions.length === 0 && completions.length > 0) {
      factors.push('No recent activity - risk of habit abandonment')
    }
    
    const avgSatisfaction = completions.reduce((sum, c) => sum + (c.satisfaction_rating || 3), 0) / completions.length
    if (avgSatisfaction < 2.5) {
      factors.push('Low satisfaction ratings indicate potential motivation issues')
    }
    
    return factors
  }

  const identifyStrengthFactors = (habit: Habit, completions: HabitCompletion[]): string[] => {
    const factors: string[] = []
    
    const streakAnalysis = calculateAdvancedStreaks(completions)
    if (streakAnalysis.longest > 14) {
      factors.push('Proven ability to maintain long streaks')
    }
    
    if (streakAnalysis.average > 7) {
      factors.push('Consistently high average streak length')
    }
    
    const avgSatisfaction = completions.reduce((sum, c) => sum + (c.satisfaction_rating || 3), 0) / completions.length
    if (avgSatisfaction > 4) {
      factors.push('High satisfaction indicates strong intrinsic motivation')
    }
    
    const recentCompletions = completions.filter(c => {
      const daysAgo = (Date.now() - new Date(c.completed_date).getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 7
    })
    
    if (recentCompletions.length >= habit.target_frequency) {
      factors.push('Meeting weekly targets consistently')
    }
    
    return factors
  }

  const analyzeBehaviorPatterns = (completions: HabitCompletion[]) => {
    return {
      timePreferences: analyzeTimePreferences(completions),
      moodPatterns: analyzeMoodPatterns(completions),
      contextualFactors: analyzeContextualFactors(completions),
      performanceIndicators: analyzePerformanceIndicators(completions)
    }
  }

  const analyzeTimePreferences = (completions: HabitCompletion[]) => {
    const timePatterns: Record<string, number> = {}
    
    completions.forEach(completion => {
      if (completion.completion_time) {
        const hour = new Date(`2000-01-01T${completion.completion_time}`).getHours()
        const period = getDetailedTimeRange(hour)
        timePatterns[period] = (timePatterns[period] || 0) + 1
      }
    })
    
    return timePatterns
  }

  const analyzeMoodPatterns = (completions: HabitCompletion[]) => {
    const moodChanges: number[] = []
    
    completions.forEach(completion => {
      if (completion.mood_after !== undefined) {
        const change = completion.mood_after - 3 // Assuming 3 is neutral
        moodChanges.push(change)
      }
    })
    
    const averageChange = moodChanges.length > 0 
      ? moodChanges.reduce((a, b) => a + b, 0) / moodChanges.length 
      : 0
    
    return {
      averageMoodImprovement: averageChange,
      positiveImpactPercentage: (moodChanges.filter(change => change > 0).length / moodChanges.length) * 100 || 0
    }
  }

  const analyzeContextualFactors = (completions: HabitCompletion[]) => {
    const locations: Record<string, number> = {}
    const companions: Record<string, number> = {}
    
    completions.forEach(completion => {
      if (completion.location) {
        locations[completion.location] = (locations[completion.location] || 0) + 1
      }
      
      if (completion.companions) {
        completion.companions.forEach(companion => {
          companions[companion] = (companions[companion] || 0) + 1
        })
      }
    })
    
    return { locations, companions }
  }

  const analyzePerformanceIndicators = (completions: HabitCompletion[]) => {
    const avgFocusScore = completions.reduce((sum, c) => sum + (c.focus_score || 3), 0) / completions.length
    const avgTimeTaken = completions.reduce((sum, c) => sum + (c.time_taken || 0), 0) / completions.length
    const avgInterruptions = completions.reduce((sum, c) => sum + (c.interruptions || 0), 0) / completions.length
    
    return {
      averageFocusScore: avgFocusScore,
      averageTimeTaken: avgTimeTaken,
      averageInterruptions: avgInterruptions,
      efficiencyTrend: generateTimeEfficiencyTrend(completions)
    }
  }

  const analyzeSocialInfluences = (completions: HabitCompletion[]) => {
    const socialContexts: Record<string, number> = {}
    
    completions.forEach(completion => {
      if (completion.social_context) {
        socialContexts[completion.social_context] = (socialContexts[completion.social_context] || 0) + 1
      }
    })
    
    return socialContexts
  }

  const generateCompletionTimeDistribution = (completions: HabitCompletion[]): number[] => {
    return completions
      .filter(c => c.time_taken && c.time_taken > 0)
      .map(c => c.time_taken!)
      .sort((a, b) => a - b)
  }

  const generateQuantityDistribution = (completions: HabitCompletion[]): number[] => {
    return completions
      .filter(c => c.quantity && c.quantity > 0)
      .map(c => c.quantity!)
      .sort((a, b) => a - b)
  }

  const calculatePerformanceCorrelations = (completions: HabitCompletion[]) => {
    const correlations: Record<string, number> = {}
    
    // Correlation between mood and performance
    const moodPerfPairs = completions
      .filter(c => c.mood_after !== undefined && c.satisfaction_rating !== undefined)
      .map(c => ({ mood: c.mood_after!, satisfaction: c.satisfaction_rating! }))
    
    if (moodPerfPairs.length > 5) {
      correlations['mood_satisfaction'] = calculateCorrelation(
        moodPerfPairs.map(p => p.mood),
        moodPerfPairs.map(p => p.satisfaction)
      )
    }
    
    // Correlation between energy and performance
    const energyPerfPairs = completions
      .filter(c => c.energy_before !== undefined && c.satisfaction_rating !== undefined)
      .map(c => ({ energy: c.energy_before!, satisfaction: c.satisfaction_rating! }))
    
    if (energyPerfPairs.length > 5) {
      correlations['energy_satisfaction'] = calculateCorrelation(
        energyPerfPairs.map(p => p.energy),
        energyPerfPairs.map(p => p.satisfaction)
      )
    }
    
    return correlations
  }

  const calculateCorrelation = (x: number[], y: number[]): number => {
    if (x.length !== y.length || x.length === 0) return 0
    
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)
    
    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    
    return denominator === 0 ? 0 : numerator / denominator
  }

  const findHabitDependencies = (habit: Habit, allHabits: Habit[], allCompletions: HabitCompletion[]): string[] => {
    const dependencies: string[] = []
    const habitCompletions = allCompletions.filter(c => c.habit_id === habit.id)
    
    // Find habits that are often completed on the same days
    allHabits
      .filter(h => h.id !== habit.id)
      .forEach(otherHabit => {
        const otherCompletions = allCompletions.filter(c => c.habit_id === otherHabit.id)
        const sameDayCompletions = habitCompletions.filter(hc => 
          otherCompletions.some(oc => oc.completed_date === hc.completed_date)
        )
        
        const coOccurrenceRate = sameDayCompletions.length / Math.min(habitCompletions.length, otherCompletions.length)
        
        if (coOccurrenceRate > 0.6 && sameDayCompletions.length > 5) {
          dependencies.push(otherHabit.id)
        }
      })
    
    return dependencies
  }

  const identifySuccessPredictors = (completions: HabitCompletion[]): string[] => {
    const predictors: string[] = []
    
    // High energy before completion
    const highEnergyCompletions = completions.filter(c => (c.energy_before || 3) >= 4)
    if (highEnergyCompletions.length / completions.length > 0.7) {
      predictors.push('High energy levels before starting')
    }
    
    // Consistent timing
    const timePatterns = analyzeTimePreferences(completions)
    const topTimeSlot = Object.entries(timePatterns).reduce((a, b) => 
      timePatterns[a[0]] > timePatterns[b[0]] ? a : b, ['Morning', 0]
    )
    
    if (timePatterns[topTimeSlot[0]] / completions.length > 0.6) {
      predictors.push(`Completing during ${topTimeSlot[0].toLowerCase()}`)
    }
    
    // Social context
    const soloCompletions = completions.filter(c => !c.companions || c.companions.length === 0)
    if (soloCompletions.length / completions.length > 0.8) {
      predictors.push('Working alone without distractions')
    }
    
    return predictors
  }

  // Enhanced Habit Management Functions
  const addAdvancedHabit = async () => {
    if (!newHabit.name.trim() || !user) return

    try {
      setLoading(true)
      
      // AI-powered success criteria generation if not provided
      let successCriteria = newHabit.success_criteria
      if (!successCriteria.trim()) {
        successCriteria = generateSmartSuccessCriteria(newHabit)
      }

      // Generate motivational quote if not provided
      let motivationQuote = newHabit.motivation_quote
      if (!motivationQuote.trim()) {
        motivationQuote = generateMotivationalQuote(newHabit.category, newHabit.name)
      }

      // Optimize target frequency based on difficulty and category
      const optimizedFrequency = optimizeTargetFrequency(newHabit.difficulty, newHabit.category, newHabit.target_frequency)

      const habitData = {
        name: newHabit.name.trim(),
        description: newHabit.description.trim(),
        category: newHabit.category,
        difficulty: newHabit.difficulty,
        priority: newHabit.priority,
        energy_level: newHabit.energy_level,
        mood_impact: newHabit.mood_impact,
        target_frequency: optimizedFrequency,
        target_days: newHabit.target_days,
        reminder_time: newHabit.reminder_time || null,
        color: newHabit.color,
        icon: newHabit.icon,
        is_quantity_based: newHabit.is_quantity_based,
        target_quantity: newHabit.is_quantity_based ? newHabit.target_quantity : null,
        unit: newHabit.is_quantity_based ? newHabit.unit : null,
        current_streak: 0,
        best_streak: 0,
        total_completions: 0,
        is_archived: false,
        notes: newHabit.notes.trim(),
        tags: newHabit.tags,
        location: newHabit.location || null,
        weather_dependent: newHabit.weather_dependent,
        is_social: newHabit.is_social,
        requires_equipment: newHabit.requires_equipment,
        equipment_list: newHabit.requires_equipment ? newHabit.equipment_list : null,
        estimated_duration: newHabit.estimated_duration,
        habit_stack: newHabit.habit_stack,
        success_criteria: successCriteria,
        failure_threshold: newHabit.failure_threshold,
        reward: newHabit.reward || null,
        penalty: newHabit.penalty || null,
        motivation_quote: motivationQuote,
        is_public: newHabit.is_public,
        accountability_partner: newHabit.accountability_partner || null,
        reminders_enabled: newHabit.reminders_enabled,
        smart_notifications: newHabit.smart_notifications,
        auto_complete_conditions: newHabit.auto_complete_conditions,
        machine_learning_suggestions: newHabit.machine_learning_suggestions,
        data_visualization_type: newHabit.data_visualization_type,
        custom_fields: newHabit.custom_fields,
        user_id: user.id,
      }

      const { data, error } = await supabase
        .from("habits")
        .insert([habitData])
        .select()
        .single()

      if (error) throw error

      setHabits(prev => [data, ...prev])
      
      // Reset form
      resetNewHabitForm()
      setShowAddHabit(false)
      
      // Show success message with personalized tips
      const categoryConfig = advancedCategoryConfig[newHabit.category as keyof typeof advancedCategoryConfig]
      console.log(`Habit created! ${categoryConfig?.expertTips[0] || 'You got this!'}`)
      
    } catch (error) {
      console.error("Error adding habit:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSmartSuccessCriteria = (habit: typeof newHabit): string => {
    const templates = {
      health: [
        "Complete without skipping for 2+ minutes",
        "Feel energized and positive afterward",
        "Maintain consistency for 21 days to form neural pathways"
      ],
      fitness: [
        "Complete target reps/duration with proper form",
        "Increase intensity or duration by 5% weekly",
        "Track heart rate and recovery metrics"
      ],
      productivity: [
        "Eliminate distractions and maintain focus throughout",
        "Complete task within estimated timeframe",
        "Achieve measurable progress toward larger goal"
      ],
      learning: [
        "Retain and can explain key concepts afterward",
        "Apply knowledge within 24 hours",
        "Build progressive complexity week over week"
      ],
      mindfulness: [
        "Maintain present-moment awareness",
        "Notice stress reduction and mental clarity",
        "Practice consistently regardless of mood"
      ]
    }

    const categoryTemplates = templates[habit.category as keyof typeof templates] || templates.health
    const baseTemplate = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)]
    
    if (habit.is_quantity_based) {
      return `${baseTemplate} - Target: ${habit.target_quantity} ${habit.unit}`
    }
    
    return baseTemplate
  }

  const generateMotivationalQuote = (category: string, habitName: string): string => {
    const quotes = {
      health: [
        "Your body is your temple. Keep it pure and clean for the soul to reside in.",
        "Health is not about the weight you lose, but about the life you gain.",
        "Take care of your body. It's the only place you have to live."
      ],
      fitness: [
        "The groundwork for all happiness is good health.",
        "Fitness is not about being better than someone else. It's about being better than you used to be.",
        "Your body can stand almost anything. It's your mind you have to convince."
      ],
      productivity: [
        "Productivity is never an accident. It's the result of commitment to excellence.",
        "Focus on being productive instead of busy.",
        "The key to productivity is to rotate your avoidance techniques."
      ],
      learning: [
        "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        "The more you learn, the more you realize how much you don't know.",
        "Education is the most powerful weapon you can use to change the world."
      ],
      mindfulness: [
        "Peace comes from within. Do not seek it without.",
        "The present moment is the only time over which we have dominion.",
        "Mindfulness is about being fully awake in our lives."
      ]
    }

    const categoryQuotes = quotes[category as keyof typeof quotes] || quotes.health
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
  }

  const optimizeTargetFrequency = (difficulty: string, category: string, currentFrequency: number): number => {
    const difficultyMultipliers = {
      'easy': 1.0,
      'medium': 0.8,
      'hard': 0.6,
      'expert': 0.4
    }

    const categoryRecommendations = {
      'health': { min: 5, max: 7, sweet_spot: 6 },
      'fitness': { min: 3, max: 6, sweet_spot: 4 },
      'productivity': { min: 5, max: 7, sweet_spot: 5 },
      'learning': { min: 4, max: 7, sweet_spot: 5 },
      'mindfulness': { min: 6, max: 7, sweet_spot: 7 }
    }

    const categoryConfig = categoryRecommendations[category as keyof typeof categoryRecommendations] || categoryRecommendations.health
    const multiplier = difficultyMultipliers[difficulty as keyof typeof difficultyMultipliers] || 1.0
    
    const recommended = Math.round(categoryConfig.sweet_spot * multiplier)
    
    // Don't override if user specifically chose a frequency, just warn if it seems unrealistic
    if (Math.abs(currentFrequency - recommended) > 2) {
      console.log(`Recommended frequency for ${difficulty} ${category} habit: ${recommended} days/week`)
    }
    
    return currentFrequency
  }

  const resetNewHabitForm = () => {
    setNewHabit({
      name: "",
      description: "",
      category: "health",
      difficulty: "medium" as const,
      priority: "medium" as const,
      energy_level: "medium" as const,
      mood_impact: 0,
      target_frequency: 1,
      target_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      reminder_time: "",
      color: "#10b981",
      icon: "target",
      is_quantity_based: false,
      target_quantity: 1,
      unit: "",
      notes: "",
      tags: [],
      location: "",
      weather_dependent: false,
      is_social: false,
      requires_equipment: false,
      equipment_list: [],
      estimated_duration: 15,
      habit_stack: [],
      success_criteria: "",
      failure_threshold: 3,
      reward: "",
      penalty: "",
      motivation_quote: "",
      is_public: false,
      accountability_partner: "",
      reminders_enabled: true,
      smart_notifications: true,
      auto_complete_conditions: [],
      machine_learning_suggestions: true,
      data_visualization_type: "line" as const,
      custom_fields: {}
    })
  }

  // Advanced Habit Completion with Detailed Tracking
  const toggleAdvancedHabitCompletion = async (habitId: string, date?: Date, completionDetails?: Partial<HabitCompletion>) => {
    if (!user) return

    const targetDate = date || new Date()
    const dateString = targetDate.toISOString().split('T')[0]

    try {
      setLoading(true)

      const existingCompletion = habitCompletions.find(
        completion => completion.habit_id === habitId && completion.completed_date === dateString
      )

      if (existingCompletion) {
        // Remove completion
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("id", existingCompletion.id)

        if (error) throw error
        setHabitCompletions(prev => prev.filter(c => c.id !== existingCompletion.id))
      } else {
        // Add detailed completion
        const habit = habits.find(h => h.id === habitId)
        if (!habit) return

        const now = new Date()
        const completionData = {
          habit_id: habitId,
          completed_date: dateString,
          quantity: completionDetails?.quantity || (habit.is_quantity_based ? habit.target_quantity : 1),
          notes: completionDetails?.notes || "",
          completion_time: completionDetails?.completion_time || now.toTimeString().split(" ")[0],
          mood_after: completionDetails?.mood_after || 4, // Default to slightly positive
          energy_before: completionDetails?.energy_before || 3,
          energy_after: completionDetails?.energy_after || 4,
          location: completionDetails?.location || currentLocation || habit.location || "Home",
          weather: completionDetails?.weather || currentWeather,
          temperature: completionDetails?.temperature || 22, // Default room temperature
          companions: completionDetails?.companions || [],
          photos: completionDetails?.photos || [],
          voice_notes: completionDetails?.voice_notes || [],
          satisfaction_rating: completionDetails?.satisfaction_rating || 4,
          difficulty_experienced: completionDetails?.difficulty_experienced || getDifficultyRating(habit.difficulty),
          time_taken: completionDetails?.time_taken || habit.estimated_duration,
          interruptions: completionDetails?.interruptions || 0,
          focus_score: completionDetails?.focus_score || 4,
          environment_rating: completionDetails?.environment_rating || 4,
          equipment_used: completionDetails?.equipment_used || habit.equipment_list || [],
          motivation_level: completionDetails?.motivation_level || 4,
          confidence_level: completionDetails?.confidence_level || 4,
          stress_level_before: completionDetails?.stress_level_before || 3,
          stress_level_after: completionDetails?.stress_level_after || 2,
          physical_condition: completionDetails?.physical_condition || "good",
          emotional_state_before: completionDetails?.emotional_state_before || "neutral",
          emotional_state_after: completionDetails?.emotional_state_after || "positive",
          external_factors: completionDetails?.external_factors || [],
          completion_method: completionDetails?.completion_method || "manual",
          social_context: completionDetails?.social_context || (habit.is_social ? "group" : "solo"),
          learned_insights: completionDetails?.learned_insights || "",
          improvement_areas: completionDetails?.improvement_areas || [],
          celebration_method: completionDetails?.celebration_method || "self-acknowledgment",
          next_action: completionDetails?.next_action || "continue_consistency",
          user_id: user.id,
        }

        const { data, error } = await supabase
          .from("habit_completions")
          .insert([completionData])
          .select()

        if (error) throw error
        if (data) {
          setHabitCompletions(prev => [...prev, data[0]])
          
          // Update habit streak and completion count
          await updateHabitStreakAndStats(habitId, true)
          
          // Check for achievements
          await checkForNewAchievements(habitId, data[0])
          
          // Generate personalized insights
          await generateCompletionInsights(habit, data[0])
        }
      }
    } catch (error) {
      console.error("Error toggling habit completion:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyRating = (difficulty: string): number => {
    const ratings = {
      'easy': 2,
      'medium': 3,
      'hard': 4,
      'expert': 5
    }
    return ratings[difficulty as keyof typeof ratings] || 3
  }

  const updateHabitStreakAndStats = async (habitId: string, completed: boolean) => {
    try {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      const habitCompletionsForHabit = habitCompletions.filter(c => c.habit_id === habitId)
      const streakAnalysis = calculateAdvancedStreaks(habitCompletionsForHabit)
      
      const updates = {
        current_streak: streakAnalysis.current,
        best_streak: Math.max(habit.best_streak, streakAnalysis.longest),
        total_completions: habit.total_completions + (completed ? 1 : -1),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from("habits")
        .update(updates)
        .eq("id", habitId)
        .eq("user_id", user.id)

      if (error) throw error

      setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, ...updates } : h
      ))
    } catch (error) {
      console.error("Error updating habit stats:", error)
    }
  }

  const checkForNewAchievements = async (habitId: string, completion: HabitCompletion) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const habitCompletionsForHabit = habitCompletions.filter(c => c.habit_id === habitId)
    const streakAnalysis = calculateAdvancedStreaks([...habitCompletionsForHabit, completion])
    
    const newAchievements: Achievement[] = []

    // Check streak achievements
    advancedAchievementLevels
      .filter(level => level.days && streakAnalysis.current >= level.days)
      .forEach(level => {
        if (!achievements.some(a => a.title === level.title)) {
          newAchievements.push({
            id: `achievement_${level.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
            title: level.title,
            description: level.description || `Achieved ${level.days} day streak`,
            icon: level.icon.name,
            color: level.color,
            requirements: { streak_days: level.days },
            points: level.points,
            rarity: level.points > 1000 ? "epic" : level.points > 500 ? "rare" : "common",
            category: level.category,
            unlocked_at: new Date().toISOString(),
            progress: level.days,
            max_progress: level.days
          })
        }
      })

    // Check completion achievements
    const totalCompletions = habit.total_completions + 1
    advancedAchievementLevels
      .filter(level => level.completions && totalCompletions >= level.completions)
      .forEach(level => {
        if (!achievements.some(a => a.title === level.title)) {
          newAchievements.push({
            id: `achievement_${level.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
            title: level.title,
            description: level.description || `Completed ${level.completions} times`,
            icon: level.icon.name,
            color: level.color,
            requirements: { total_completions: level.completions },
            points: level.points,
            rarity: level.points > 1000 ? "epic" : level.points > 500 ? "rare" : "common",
            category: level.category,
            unlocked_at: new Date().toISOString(),
            progress: level.completions,
            max_progress: level.completions
          })
        }
      })

    // Add new achievements and show celebrations
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements])
      newAchievements.forEach(achievement => {
        console.log(`🎉 Achievement Unlocked: ${achievement.title} (+${achievement.points} points)`)
      })
    }
  }

  const generateCompletionInsights = async (habit: Habit, completion: HabitCompletion) => {
    const insights: string[] = []
    
    // Mood impact analysis
    const moodImprovement = (completion.mood_after || 3) - 3 // Assuming 3 is neutral
    if (moodImprovement > 1) {
      insights.push(`This habit significantly boosted your mood by ${moodImprovement} points!`)
    }
    
    // Energy analysis
    const energyChange = (completion.energy_after || 3) - (completion.energy_before || 3)
    if (energyChange > 1) {
      insights.push(`Great energy boost! You gained ${energyChange} energy points from this habit.`)
    } else if (energyChange < -1) {
      insights.push(`This habit was energy-intensive. Consider adjusting intensity or timing.`)
    }
    
    // Focus and performance
    if ((completion.focus_score || 3) >= 4) {
      insights.push(`Excellent focus during this session! Your concentration is improving.`)
    }
    
    // Time efficiency
    const expectedTime = habit.estimated_duration
    const actualTime = completion.time_taken || expectedTime
    if (actualTime < expectedTime * 0.8) {
      insights.push(`Impressive efficiency! You completed this ${Math.round(((expectedTime - actualTime) / expectedTime) * 100)}% faster than estimated.`)
    }
    
    // Environmental factors
    if (completion.interruptions === 0) {
      insights.push(`Perfect environment with no interruptions. This setup works well for you!`)
    }
    
    // Store insights for later display
    console.log("Session insights:", insights.join(" "))
  }

  // Advanced Filtering and Search Functions
  const filteredAndSortedHabits = useMemo(() => {
    let filtered = habits.filter(habit => {
      if (!showArchived && habit.is_archived) return false
      if (showArchived && !habit.is_archived) return false
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        if (
          !habit.name.toLowerCase().includes(searchLower) &&
          !habit.description?.toLowerCase().includes(searchLower) &&
          !habit.tags?.some(tag => tag.toLowerCase().includes(searchLower)) &&
          !habit.category.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }
      
      if (filterCategory !== "all" && habit.category !== filterCategory) return false
      if (filterDifficulty !== "all" && habit.difficulty !== filterDifficulty) return false
      if (filterPriority !== "all" && habit.priority !== filterPriority) return false
      
      return true
    })

    // Advanced sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case "streak":
          aValue = habitStats[a.id]?.currentStreak || 0
          bValue = habitStats[b.id]?.currentStreak || 0
          break
        case "completion_rate":
          aValue = habitStats[a.id]?.completionRate || 0
          bValue = habitStats[b.id]?.completionRate || 0
          break
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 2
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 2
          break
        case "name":
          return sortOrder === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
      }
      
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [habits, habitStats, showArchived, searchTerm, filterCategory, filterDifficulty, filterPriority, sortBy, sortOrder])

  // Bulk Operations
  const handleBulkAction = async (action: string) => {
    if (selectedHabits.size === 0) return

    try {
      setLoading(true)
      const habitIds = Array.from(selectedHabits)

      switch (action) {
        case "archive":
          await bulkArchiveHabits(habitIds, true)
          break
        case "unarchive":
          await bulkArchiveHabits(habitIds, false)
          break
        case "delete":
          await bulkDeleteHabits(habitIds)
          break
        case "mark_complete":
          await bulkMarkComplete(habitIds)
          break
        case "export":
          await exportHabitsData(habitIds)
          break
        default:
          console.log("Unknown bulk action:", action)
      }

      setSelectedHabits(new Set())
      setBulkActionMode(false)
    } catch (error) {
      console.error("Error performing bulk action:", error)
    } finally {
      setLoading(false)
    }
  }

  const bulkArchiveHabits = async (habitIds: string[], archive: boolean) => {
    const { error } = await supabase
      .from("habits")
      .update({ is_archived: archive })
      .in("id", habitIds)
      .eq("user_id", user.id)

    if (error) throw error

    setHabits(prev => prev.map(habit => 
      habitIds.includes(habit.id) ? { ...habit, is_archived: archive } : habit
    ))
  }

  const bulkDeleteHabits = async (habitIds: string[]) => {
    const { error } = await supabase
      .from("habits")
      .delete()
      .in("id", habitIds)
      .eq("user_id", user.id)

    if (error) throw error

    setHabits(prev => prev.filter(habit => !habitIds.includes(habit.id)))
    setHabitCompletions(prev => prev.filter(completion => !habitIds.includes(completion.habit_id)))
  }

  const bulkMarkComplete = async (habitIds: string[]) => {
    const today = new Date().toISOString().split('T')[0]
    const completions: any[] = []

    habitIds.forEach(habitId => {
      const existing = habitCompletions.find(c => 
        c.habit_id === habitId && c.completed_date === today
      )
      
      if (!existing) {
        completions.push({
          habit_id: habitId,
          completed_date: today,
          quantity: 1,
          completion_time: new Date().toTimeString().split(" ")[0],
          mood_after: 4,
          satisfaction_rating: 4,
          user_id: user.id
        })
      }
    })

    if (completions.length > 0) {
      const { data, error } = await supabase
        .from("habit_completions")
        .insert(completions)
        .select()

      if (error) throw error
      if (data) {
        setHabitCompletions(prev => [...prev, ...data])
      }
    }
  }

  const exportHabitsData = async (habitIds: string[]) => {
    const habitsToExport = habits.filter(h => habitIds.includes(h.id))
    const completionsToExport = habitCompletions.filter(c => habitIds.includes(c.habit_id))
    
    const exportData = {
      habits: habitsToExport,
      completions: completionsToExport,
      stats: Object.fromEntries(
        Object.entries(habitStats).filter(([id]) => habitIds.includes(id))
      ),
      export_date: new Date().toISOString(),
      user_id: user.id
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `habits_export_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  // Archive and Delete Functions
  const archiveHabit = async (habitId: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from("habits")
        .update({ is_archived: true })
        .eq("id", habitId)
        .eq("user_id", user.id)

      if (error) throw error
      setHabits(prev => prev.map(habit => 
        habit.id === habitId ? { ...habit, is_archived: true } : habit
      ))
    } catch (error) {
      console.error("Error archiving habit:", error)
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId)
        .eq("user_id", user.id)

      if (error) throw error
      setHabits(prev => prev.filter(habit => habit.id !== habitId))
      setHabitCompletions(prev => prev.filter(completion => completion.habit_id !== habitId))
    } catch (error) {
      console.error("Error deleting habit:", error)
    }
  }

  // Utility Functions
  const getCompletionForDate = (habitId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return habitCompletions.find(
      completion => completion.habit_id === habitId && completion.completed_date === dateString
    )
  }

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-600"
    if (rate >= 75) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    if (rate >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-600"
    if (streak >= 14) return "text-blue-600"
    if (streak >= 7) return "text-green-600"
    if (streak >= 3) return "text-yellow-600"
    return "text-gray-600"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: "text-red-700 bg-red-100",
      high: "text-orange-700 bg-orange-100",
      medium: "text-yellow-700 bg-yellow-100",
      low: "text-green-700 bg-green-100"
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  // Calculate overall dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalActiveHabits = habits.filter(h => !h.is_archived).length
    const today = new Date().toISOString().split('T')[0]
    const completedToday = habitCompletions.filter(c => c.completed_date === today).length
    
    const overallCompletionRate = totalActiveHabits > 0
      ? Object.values(habitStats).reduce((sum, stats) => sum + stats.completionRate, 0) / totalActiveHabits
      : 0
    
    const totalStreakDays = Object.values(habitStats).reduce((sum, stats) => sum + stats.currentStreak, 0)
    const avgStreakLength = totalActiveHabits > 0 ? totalStreakDays / totalActiveHabits : 0
    
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.total_completions, 0)
    
    const perfectDays = (() => {
      const dayCompletions: Record<string, number> = {}
      habitCompletions.forEach(c => {
        dayCompletions[c.completed_date] = (dayCompletions[c.completed_date] || 0) + 1
      })
      return Object.values(dayCompletions).filter(count => count === totalActiveHabits).length
    })()
    
    return {
      totalActiveHabits,
      completedToday,
      overallCompletionRate,
      avgStreakLength,
      totalCompletions,
      perfectDays,
      consistencyScore: Math.min(overallCompletionRate + (avgStreakLength * 2), 100)
    }
  }, [habits, habitCompletions, habitStats])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <GlassCard className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Habit Mastery</h2>
          <p className="text-slate-600 mb-6">Sign in to start building life-changing habits with AI-powered insights and personalized coaching.</p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Sign In to Continue
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header Dashboard */}
        <GlassCard className="p-6 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/30 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                {dashboardStats.completedToday > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{dashboardStats.completedToday}</span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Habit Mastery Pro
                </h1>
                <p className="text-slate-600 font-medium">AI-powered habit tracking with advanced analytics</p>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-slate-600">
                    Consistency Score: {dashboardStats.consistencyScore.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {bulkActionMode ? (
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2">
                  <span className="text-sm font-medium text-slate-700 px-2">
                    {selectedHabits.size} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction("mark_complete")}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                    title="Mark all complete"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBulkAction("archive")}
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-all"
                    title="Archive selected"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                    title="Delete selected"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBulkAction("export")}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                    title="Export data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setBulkActionMode(false)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setBulkActionMode(true)}
                    className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-xl text-slate-700 font-medium hover:bg-white/80 transition-all"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Bulk Actions
                  </button>
                  
                  <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-inner border border-white/30">
                    {(["grid", "list", "calendar", "analytics"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1",
                          viewMode === mode
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-105"
                            : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                        )}
                      >
                        {mode === "grid" && <LayoutGrid className="w-4 h-4" />}
                        {mode === "list" && <List className="w-4 h-4" />}
                        {mode === "calendar" && <Calendar className="w-4 h-4" />}
                        {mode === "analytics" && <BarChart3 className="w-4 h-4" />}
                        <span className="hidden sm:inline">
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddHabit(!showAddHabit)}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search habits, tags, or descriptions..."
                className="w-full bg-white/60 backdrop-blur-sm border border-white/30 pl-10 pr-4 py-3 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="all">All Categories</option>
                {Object.keys(advancedCategoryConfig).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="all">All Difficulties</option>
                {Object.entries(advancedDifficultyConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="created_at">Date Created</option>
                <option value="name">Name</option>
                <option value="streak">Current Streak</option>
                <option value="completion_rate">Completion Rate</option>
                <option value="priority">Priority</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-white/80 transition-all"
                title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
              >
                {sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm",
                  showArchived
                    ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg"
                    : "bg-white/60 backdrop-blur-sm border border-white/30 text-slate-600 hover:text-slate-800 hover:bg-white/80"
                )}
              >
                {showArchived ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">
                  {showArchived ? "Hide Archived" : "Show Archived"}
                </span>
              </button>
            </div>
          </div>

          {/* Dashboard Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-gradient-to-br from-emerald-50/80 to-green-100/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Today</span>
              </div>
              <div className="text-2xl font-bold text-emerald-900">{dashboardStats.completedToday}</div>
              <div className="text-xs text-emerald-700">
                of {dashboardStats.totalActiveHabits} habits
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{dashboardStats.totalActiveHabits}</div>
              <div className="text-xs text-blue-700">habits tracking</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50/80 to-violet-100/80 backdrop-blur-sm p-4 rounded-xl border border-purple-200/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Success</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {dashboardStats.overallCompletionRate.toFixed(0)}%
              </div>
              <div className="text-xs text-purple-700">completion rate</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50/80 to-red-100/80 backdrop-blur-sm p-4 rounded-xl border border-orange-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {dashboardStats.avgStreakLength.toFixed(1)}
              </div>
              <div className="text-xs text-orange-700">avg days</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50/80 to-amber-100/80 backdrop-blur-sm p-4 rounded-xl border border-yellow-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Total</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{dashboardStats.totalCompletions}</div>
              <div className="text-xs text-yellow-700">completions</div>
            </div>

            <div className="bg-gradient-to-br from-pink-50/80 to-rose-100/80 backdrop-blur-sm p-4 rounded-xl border border-pink-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-pink-800">Perfect</span>
              </div>
              <div className="text-2xl font-bold text-pink-900">{dashboardStats.perfectDays}</div>
              <div className="text-xs text-pink-700">days</div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50/80 to-teal-100/80 backdrop-blur-sm p-4 rounded-xl border border-cyan-200/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-cyan-600" />
                <span className="text-sm font-medium text-cyan-800">Score</span>
              </div>
              <div className="text-2xl font-bold text-cyan-900">
                {dashboardStats.consistencyScore.toFixed(0)}
              </div>
              <div className="text-xs text-cyan-700">consistency</div>
            </div>
          </div>
        </GlassCard>

        {/* Advanced Add Habit Form */}
        {showAddHabit && (
          <GlassCard className="p-6 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Create New Habit</h3>
              </div>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <Lightbulb className="w-4 h-4" />
                Use Template
              </button>
            </div>

            {showTemplates && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-xl border border-purple-200/30">
                <h4 className="font-semibold text-purple-800 mb-3">Scientifically-Backed Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scientificHabitTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setNewHabit(prev => ({
                          ...prev,
                          name: template.name,
                          description: template.description,
                          category: template.category,
                          difficulty: template.difficulty,
                          target_frequency: template.target_frequency,
                          target_days: template.target_days,
                          color: template.color,
                          icon: template.icon,
                          is_quantity_based: template.is_quantity_based,
                          target_quantity: template.target_quantity || 1,
                          unit: template.unit || "",
                          tags: template.tags,
                          estimated_duration: template.estimated_duration,
                          equipment_list: template.equipment_list || [],
                          success_criteria: template.success_criteria,
                          motivation_quote: template.motivation_quote
                        }))
                        setShowTemplates(false)
                      }}
                      className="p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg text-left hover:bg-white/80 transition-all"
                    >
                      <div className="font-medium text-slate-800">{template.name}</div>
                      <div className="text-sm text-slate-600 mt-1 line-clamp-2">{template.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-700">
                          {template.category}
                        </span>
                        <span className="text-xs text-slate-500">
                          {template.estimated_duration} min
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-slate-500">{template.user_rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Type className="w-4 h-4" />
                      Habit Name *
                    </label>
                    <input
                      type="text"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Morning Meditation, Daily Reading, Exercise..."
                      className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <BookOpen className="w-4 h-4" />
                      Category
                    </label>
                    <select
                      value={newHabit.category}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    >
                      {Object.entries(advancedCategoryConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Target className="w-4 h-4" />
                      Difficulty Level
                    </label>
                    <select
                      value={newHabit.difficulty}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    >
                      {Object.entries(advancedDifficultyConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label} - {config.timeCommitment}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Flag className="w-4 h-4" />
                      Priority Level
                    </label>
                    <select
                      value={newHabit.priority}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Description & Why This Matters
                </label>
                <textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your habit and why it's important to you. What will achieving this habit give you?"
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 placeholder-slate-500 h-24 resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all"
                />
              </div>

              {/* Frequency and Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Target Frequency
                  </label>
                  <input
                    type="number"
                    value={newHabit.target_frequency}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, target_frequency: parseInt(e.target.value) }))}
                    min="1"
                    max="7"
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <span className="text-xs text-slate-500 mt-1">days per week</span>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Clock className="w-4 h-4" />
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={newHabit.reminder_time}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, reminder_time: e.target.value }))}
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Timer className="w-4 h-4" />
                    Estimated Duration
                  </label>
                  <input
                    type="number"
                    value={newHabit.estimated_duration}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) }))}
                    min="1"
                    max="240"
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <span className="text-xs text-slate-500 mt-1">minutes</span>
                </div>
              </div>

              {/* Quantity-based Configuration */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newHabit.is_quantity_based}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, is_quantity_based: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Hash className="w-4 h-4" />
                    Quantity-based habit (track specific amounts)
                  </span>
                </label>

                {newHabit.is_quantity_based && (
                  <div className="grid grid-cols-2 gap-4 pl-7">
                    <div>
                      <label className="text-sm font-medium text-slate-600 mb-1 block">Target Quantity</label>
                      <input
                        type="number"
                        value={newHabit.target_quantity}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, target_quantity: parseInt(e.target.value) }))}
                        min="1"
                        className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-2 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 mb-1 block">Unit</label>
                      <input
                        type="text"
                        value={newHabit.unit}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="pages, minutes, reps..."
                        className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-2 rounded-lg text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Settings className="w-5 h-5" />
                  Advanced Options
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHabit.weather_dependent}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, weather_dependent: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <Cloud className="w-4 h-4" />
                      Weather dependent
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHabit.is_social}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, is_social: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <Users className="w-4 h-4" />
                      Social activity
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHabit.requires_equipment}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, requires_equipment: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <Wrench className="w-4 h-4" />
                      Requires equipment
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHabit.smart_notifications}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, smart_notifications: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 border-2 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <Brain className="w-4 h-4" />
                      AI-powered reminders
                    </span>
                  </label>
                </div>
              </div>

              {/* Success Criteria */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  Success Criteria (Optional)
                </label>
                <input
                  type="text"
                  value={newHabit.success_criteria}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, success_criteria: e.target.value }))}
                  placeholder="How will you know you've successfully completed this habit?"
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 outline-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addAdvancedHabit}
                  disabled={!newHabit.name.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Intelligent Habit
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="px-6 bg-white/60 backdrop-blur-sm border border-white/30 text-slate-700 font-semibold rounded-xl hover:bg-white/80 hover:scale-[1.02] transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Main Content Based on View Mode */}
        {viewMode === "analytics" ? (
          <GlassCard className="p-6 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Advanced Analytics
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="bg-white/60 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completion Rate Trends */}
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm p-4 rounded-xl border border-blue-200/30">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Completion Rate Trends
                </h3>
                <div className="h-48 flex items-center justify-center text-slate-500">
                  Analytics visualization would be rendered here
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-gradient-to-br from-green-50/80 to-emerald-100/80 backdrop-blur-sm p-4 rounded-xl border border-green-200/30">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Category Performance
                </h3>
                <div className="space-y-2">
                  {Object.entries(advancedCategoryConfig).map(([category, config]) => {
                    const categoryHabits = filteredAndSortedHabits.filter(h => h.category === category)
                    const avgCompletion = categoryHabits.length > 0
                      ? categoryHabits.reduce((sum, h) => sum + (habitStats[h.id]?.completionRate || 0), 0) / categoryHabits.length
                      : 0

                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 capitalize flex items-center gap-2">
                          <config.icon className="w-4 h-4" />
                          {category}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${avgCompletion}%` }}
                            />
                          </div>
                          <span className={cn("text-sm font-medium", getCompletionRateColor(avgCompletion))}>
                            {avgCompletion.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Streak Analysis */}
              <div className="bg-gradient-to-br from-orange-50/80 to-red-100/80 backdrop-blur-sm p-4 rounded-xl border border-orange-200/30">
                <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Streak Distribution
                </h3>
                <div className="space-y-3">
                  {filteredAndSortedHabits.slice(0, 5).map(habit => {
                    const stats = habitStats[habit.id]
                    return (
                      <div key={habit.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 truncate flex-1 mr-2">
                          {habit.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-bold", getStreakColor(stats?.currentStreak || 0))}>
                            {stats?.currentStreak || 0}
                          </span>
                          <span className="text-xs text-slate-500">
                            (best: {stats?.longestStreak || 0})
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-purple-50/80 to-violet-100/80 backdrop-blur-sm p-4 rounded-xl border border-purple-200/30">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Insights
                </h3>
                <div className="space-y-2">
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="text-sm text-slate-700">
                      Your productivity habits show 23% better performance in the morning hours.
                    </p>
                  </div>
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="text-sm text-slate-700">
                      Fitness habits have 67% higher completion rate when scheduled after meals.
                    </p>
                  </div>
                  <div className="p-2 bg-white/50 rounded-lg">
                    <p className="text-sm text-slate-700">
                      Your consistency improves by 45% during weekdays vs weekends.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          /* Habit Display Modes */
          <div className={cn(
            "grid gap-6",
            viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" :
            viewMode === "list" ? "grid-cols-1" :
            "grid-cols-1"
          )}>
            {filteredAndSortedHabits.length === 0 ? (
              <div className="col-span-full">
                <GlassCard className="p-12 text-center bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/30">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <Target className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-3">
                    {showArchived ? "No archived habits found" : searchTerm ? "No habits match your search" : "Ready to build amazing habits?"}
                  </h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    {showArchived 
                      ? "You haven't archived any habits yet. Archived habits help you keep track of past goals."
                      : searchTerm 
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Start your transformation journey by creating your first intelligent habit. Our AI will help optimize it for maximum success."
                    }
                  </p>
                  {!showArchived && (
                    <button
                      onClick={() => setShowAddHabit(true)}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      Create Your First Habit
                    </button>
                  )}
                </GlassCard>
              </div>
            ) : (
              filteredAndSortedHabits.map((habit) => {
                const stats = habitStats[habit.id]
                const categoryConfig = advancedCategoryConfig[habit.category as keyof typeof advancedCategoryConfig]
                const CategoryIcon = categoryConfig?.icon || Target
                const isCompletedToday = habitCompletions.some(
                  completion => 
                    completion.habit_id === habit.id && 
                    completion.completed_date === new Date().toISOString().split('T')[0]
                )

                return (
                  <GlassCard
                    key={habit.id}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer",
                      "bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/30",
                      isCompletedToday && "ring-2 ring-emerald-400/30 bg-gradient-to-br from-emerald-50/90 to-green-50/90",
                      bulkActionMode && "select-none",
                      selectedHabits.has(habit.id) && "ring-2 ring-blue-400/50 bg-gradient-to-br from-blue-50/90 to-indigo-50/90"
                    )}
                    onClick={() => {
                      if (bulkActionMode) {
                        const newSelected = new Set(selectedHabits)
                        if (selectedHabits.has(habit.id)) {
                          newSelected.delete(habit.id)
                        } else {
                          newSelected.add(habit.id)
                        }
                        setSelectedHabits(newSelected)
                      } else {
                        setSelectedHabit(selectedHabit === habit.id ? null : habit.id)
                      }
                    }}
                  >
                    {/* Bulk Selection Checkbox */}
                    {bulkActionMode && (
                      <div className="absolute top-4 left-4 z-10">
                        <input
                          type="checkbox"
                          checked={selectedHabits.has(habit.id)}
                          onChange={() => {}}
                          className="w-5 h-5 text-blue-600 border-2 border-white/50 rounded focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                        />
                      </div>
                    )}

                    <div className={cn("p-6", bulkActionMode && "pt-12")}>
                      {/* Habit Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Completion Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleAdvancedHabitCompletion(habit.id)
                            }}
                            className="mt-1 transition-all duration-200 hover:scale-110"
                          >
                            {isCompletedToday ? (
                              <div className="relative">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-lg" />
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
                              </div>
                            ) : (
                              <Circle className="w-8 h-8 text-slate-400 hover:text-emerald-500 transition-colors" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            {/* Habit Name and Priority */}
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={cn(
                                "font-bold text-lg truncate transition-colors",
                                isCompletedToday ? "text-emerald-700" : "text-slate-800"
                              )}>
                                {habit.name}
                              </h3>
                              <div className={cn(
                                "px-2 py-1 rounded-full text-xs font-bold shrink-0",
                                getPriorityColor(habit.priority)
                              )}>
                                {habit.priority.toUpperCase()}
                              </div>
                            </div>

                            {/* Category and Metadata */}
                            <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <CategoryIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium capitalize">{habit.category}</span>
                              </div>

                              <div className={cn(
                                "px-2 py-1 rounded-full text-xs font-bold",
                                advancedDifficultyConfig[habit.difficulty].bg,
                                advancedDifficultyConfig[habit.difficulty].color
                              )}>
                                {advancedDifficultyConfig[habit.difficulty].label}
                              </div>

                              {habit.estimated_duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs">{habit.estimated_duration}min</span>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            {habit.description && (
                              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingCompletion(editingCompletion === habit.id ? null : habit.id)
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-all"
                            title="Edit completions"
                          >
                            <Edit3 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              archiveHabit(habit.id)
                            }}
                            className="p-2 hover:bg-yellow-100 rounded-lg transition-all"
                            title="Archive habit"
                          >
                            <Archive className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteHabit(habit.id)
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-all"
                            title="Delete habit"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {/* Streak and Achievement Display */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <span className={cn("font-bold text-lg", getStreakColor(stats?.currentStreak || 0))}>
                              {stats?.currentStreak || 0}
                            </span>
                            <span className="text-sm text-slate-600">day streak</span>
                          </div>
                          {stats?.longestStreak && stats.longestStreak > 0 && (
                            <div className="text-xs text-slate-500">
                              (best: {stats.longestStreak})
                            </div>
                          )}
                        </div>

                        {stats && (
                          <div className="text-right">
                            <div className={cn("text-lg font-bold", getCompletionRateColor(stats.completionRate))}>
                              {stats.completionRate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-500">success rate</div>
                          </div>
                        )}
                      </div>

                      {/* Progress Visualization */}
                      {stats && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                            <span>Last 7 days</span>
                            <span>{stats.weeklyProgress.filter(d => d === 1).length}/7</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {stats.weeklyProgress.map((completed, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "flex-1 h-3 rounded-sm transition-colors",
                                  completed ? "bg-gradient-to-r from-emerald-400 to-green-500" : "bg-slate-200"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {habit.tags && habit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {habit.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {habit.tags.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                              +{habit.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Expanded Details */}
                      {selectedHabit === habit.id && stats && (
                        <div className="pt-4 border-t border-slate-200/50 space-y-4">
                          {/* Detailed Statistics */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                              <div className="text-lg font-bold text-slate-800">{stats.totalDays}</div>
                              <div className="text-xs text-slate-600">Total Days</div>
                            </div>
                            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                              <div className="text-lg font-bold text-slate-800">
                                {stats.averageStreak.toFixed(1)}
                              </div>
                              <div className="text-xs text-slate-600">Avg Streak</div>
                            </div>
                            <div className="text-center p-3 bg-white/60 backdrop-blur-sm rounded-xl">
                              <div className="text-lg font-bold text-slate-800">
                                {stats.bestTime || 'N/A'}
                              </div>
                              <div className="text-xs text-slate-600">Best Time</div>
                            </div>
                          </div>

                          {/* Monthly Progress Heatmap */}
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                              <span>Last 30 days</span>
                              <span>{stats.monthlyProgress.filter(d => d === 1).length}/30</span>
                            </div>
                            <div className="grid grid-cols-10 gap-1">
                              {stats.monthlyProgress.map((completed, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "aspect-square rounded-sm",
                                    completed ? "bg-gradient-to-br from-emerald-400 to-green-500" : "bg-slate-200"
                                  )}
                                />
                              ))}
                            </div>
                          </div>

                          {/* AI Insights */}
                          {stats.personalizedInsights.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-purple-600" />
                                AI Insights
                              </h4>
                              <div className="space-y-2">
                                {stats.personalizedInsights.slice(0, 2).map((insight, i) => (
                                  <div key={i} className="p-2 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 rounded-lg border border-purple-200/30">
                                    <p className="text-sm text-purple-800">{insight}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Optimization Suggestions */}
                          {stats.optimizationSuggestions.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-600" />
                                Suggestions
                              </h4>
                              <div className="space-y-2">
                                {stats.optimizationSuggestions.slice(0, 2).map((suggestion, i) => (
                                  <div key={i} className="p-2 bg-gradient-to-r from-yellow-50/80 to-orange-50/80 rounded-lg border border-yellow-200/30">
                                    <p className="text-sm text-yellow-800">{suggestion}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

  const identifyFailurePredictors = (completions: HabitCompletion[]): string[] => {
    const predictors: string[] = []
    
    // Low satisfaction patterns
    const lowSatCompletions = completions.filter(c => (c.satisfaction_rating || 3) <= 2)
    if (lowSatCompletions.length / completions.length > 0.3) {
      predictors.push('Low satisfaction scores indicating poor fit')
    }
    
    // High interruption frequency
    const highInterruptionCompletions = completions.filter(c => (c.interruptions || 0) >= 3)
    if (highInterruptionCompletions.length / completions.length > 0.4) {
      predictors.push('Frequent interruptions disrupting flow')
    }
    
    // Inconsistent timing
    const timePatterns = analyzeTimePreferences(completions)
    const timeDistribution = Object.values(timePatterns)
    const maxTime = Math.max(...timeDistribution)
    if (maxTime / completions.length < 0.4) {
      predictors.push('Inconsistent timing reducing automaticity')
    }
    
    return predictors
  }

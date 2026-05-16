import {
  Calculator,
  Clock,
  ArrowLeftRight,
  Table,
  Ruler,
  Microscope,
  Hash,
  type LucideIcon,
} from "lucide-react"

export interface ToolData {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  features: string[]
  badge: string
  badgeColor: string
  gradient: string
  category: string
}

// Professional gradient color palette for tool cards
export const gradients = {
  productivity: "from-blue-500 to-purple-600",
  development: "from-emerald-500 to-teal-600",
  creative: "from-orange-500 to-red-500",
  entertainment: "from-purple-500 to-pink-500",
  communication: "from-pink-500 to-rose-500",
  analytics: "from-indigo-500 to-blue-600",
  education: "from-yellow-500 to-orange-500",
  utility: "from-teal-500 to-cyan-500",
  security: "from-red-500 to-pink-500",
  finance: "from-green-500 to-emerald-600",
}

export const toolsData: ToolData[] = [
  {
    id: "decimal-to-char",
    title: "Decimal to ASCII",
    description:
      "Convert decimal, binary, and hex ASCII codes to characters instantly. Also encode plain ASCII text back to decimal, binary, and hex in one screen.",
    icon: Table,
    href: "/tools/decimal-to-char",
    features: [
      "ASCII-only conversion (0-127) with clear validation",
      "Decimal / binary / hex / text tabs in one workflow",
      "One-click copy with normalized code previews",
      "Free, fast, mobile-friendly",
    ],
    badge: "Encoding",
    badgeColor: "bg-cyan-500",
    gradient: gradients.analytics,
    category: "Utility",
  },
  {
    id: "decimal-to-millimeter",
    title: "Decimal to Millimeter",
    description:
      "Convert decimal inches to millimeters (and back) instantly using the exact 25.4 factor. Includes fraction input support, precision modes, and one-tap copy.",
    icon: ArrowLeftRight,
    href: "/tools/decimal-to-millimeter",
    features: [
      "Bidirectional inch ↔ mm conversion with one-tap swap",
      "Supports decimal, fraction, and mixed fraction input",
      "Standard / precision / rounded output modes",
      "Live conversion, copy-ready, mobile-friendly",
    ],
    badge: "Engineering",
    badgeColor: "bg-blue-500",
    gradient: gradients.development,
    category: "Utility",
  },
  {
    id: "decimal-to-inches-calculator",
    title: "Decimal to Inches Calculator",
    description:
      "Convert decimal inches into exact and nearest fractions with selectable tape precision (1/4 to 1/64), rounding direction controls, feet-inch output, and visual ruler mapping.",
    icon: Ruler,
    href: "/tools/decimal-to-inches-calculator",
    features: [
      "Exact simplified fraction plus nearest match by selected denominator",
      "Rounding modes: nearest, always up, always down",
      "Feet-inch formatting for values over 12 inches",
      "Digital ruler marker aligned with fraction position",
    ],
    badge: "Workshop",
    badgeColor: "bg-cyan-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "millimeters-to-decimal",
    title: "Millimeters to Decimal",
    description:
      "Convert millimeters to decimal inches with engineering-grade precision, nearest common fractions, and copy-ready output for machining and QA workflows.",
    icon: Ruler,
    href: "/tools/millimeters-to-decimal",
    features: [
      "Exact formula: inches = millimeters / 25.4",
      "Nearest fraction bridge up to 1/64 with offset display",
      "Rounding modes: nearest, up, and down",
      "Decimal, unit, and fraction copy formats",
    ],
    badge: "Engineering",
    badgeColor: "bg-cyan-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "hours-to-decimal-calculator",
    title: "Hours to Decimal Calculator",
    description:
      "Convert HH:MM or smart time strings into decimal hours for payroll and billing. Includes quarter-hour, tenth-hour, and 7-minute payroll rounding modes plus batch export.",
    icon: Clock,
    href: "/tools/hours-to-decimal-calculator",
    features: [
      "Smart parser: 1:30, 1h 30m, 90 min, and standard H/M/S fields",
      "Rounding modes: none, quarter-hour, tenth-hour, and 7-minute rule",
      "Optional hourly rate with instant payout calculation",
      "Batch table with grand totals and CSV/PDF export",
    ],
    badge: "Payroll",
    badgeColor: "bg-purple-500",
    gradient: gradients.analytics,
    category: "Business",
  },
  {
    id: "time-to-decimal-converter",
    title: "Time to Decimal Converter",
    description:
      "Convert flexible time formats like 01:30:45, 1h 30m, or 2:30 PM into decimal hours, minutes, or days. Includes precision controls, interpretation chips, and reverse conversion.",
    icon: Clock,
    href: "/tools/time-to-decimal-converter",
    features: [
      "Flexible parser supports colon, textual, and clock-time inputs",
      "Output base switch: decimal hours, decimal minutes, or decimal days",
      "Excel-friendly output toggle for copy-and-paste workflows",
      "One-click swap between time-to-decimal and decimal-to-time",
    ],
    badge: "Analytics",
    badgeColor: "bg-indigo-500",
    gradient: gradients.analytics,
    category: "Business",
  },
  {
    id: "hexa-to-decimal",
    title: "Hexa to Decimal",
    description:
      "Developer-focused hex converter with signed/unsigned output, bit-depth toggles, endian controls, binary/octal/ASCII previews, and bit-flip debugging.",
    icon: Hash,
    href: "/tools/hexa-to-decimal",
    features: [
      "Parses plain hex, 0x-prefixed values, and space-separated byte input",
      "8/16/32/64-bit signed two's complement with BigInt-safe calculations",
      "Omni-result output: decimal, binary, octal, ASCII, and UTF-8 previews",
      "Interactive bit-flip visualizer plus one-click copy formats",
    ],
    badge: "Debug",
    badgeColor: "bg-indigo-500",
    gradient: gradients.analytics,
    category: "Utility",
  },
  {
    id: "inches-to-decimals",
    title: "Inches to Decimals",
    description:
      "Convert fractions and mixed inches into decimal values with up to 6 places, quick fraction grid, auto-copy mode, and metric millimeter preview.",
    icon: Ruler,
    href: "/tools/inches-to-decimals",
    features: [
      "Smart parser for 5/8, 1 3/4, and 1-3/4 input styles",
      "Live decimal inch output plus millimeter conversion",
      "Auto-copy toggle for rapid spreadsheet/CAD data entry",
      "Quick-pick grid from 1/2 through 1/64 fractions",
    ],
    badge: "CAD",
    badgeColor: "bg-cyan-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "gauge-to-decimal",
    title: "Gauge to Decimal",
    description:
      "Convert gauge sizes to decimal inches and millimeters for sheet metal and wire standards. Fast material-specific results with tolerance ranges and quick search.",
    icon: Microscope,
    href: "/tools/gauge-to-decimal",
    features: [
      "Supports sheet steel, galvanized, stainless, aluminum, and AWG wire",
      "Shows inch + millimeter values with production-friendly precision",
      "Tolerance range and visual thickness reference included",
      "Free, fast, mobile-friendly",
    ],
    badge: "Manufacturing",
    badgeColor: "bg-emerald-500",
    gradient: gradients.utility,
    category: "Utility",
  },
  {
    id: "decimal-to-text",
    title: "Decimal to Text",
    description:
      "Decode decimal character codes into plain text instantly. Convert inputs like 72 101 108 108 111 to Hello for debugging, quick data checks, and encoding practice.",
    icon: Hash,
    href: "/tools/decimal-to-text",
    features: [
      "Supports space/comma/newline separated decimal codes",
      "ASCII and Unicode code point decoding",
      "Copy-ready output with normalized decimal + hex previews",
      "Free, fast, mobile-friendly",
    ],
    badge: "Writing",
    badgeColor: "bg-cyan-500",
    gradient: gradients.analytics,
    category: "Utility",
  },
  {
    id: "fraction-to-decimal",
    title: "Fraction to Decimal",
    description:
      "Convert proper fractions, improper fractions, and mixed numbers to decimals — and decimals back to simplified fractions. Built for homework and quick math (not tape-measure inches).",
    icon: Calculator,
    href: "/tools/fraction-to-decimal",
    features: [
      "Fraction ↔ decimal with clear repeating-decimal notes",
      "Shared math engine with our other converters",
      "Adjustable precision & one-tap copy",
      "Free, fast, mobile-friendly",
    ],
    badge: "Math",
    badgeColor: "bg-violet-500",
    gradient: gradients.education,
    category: "Education",
  },
  {
    id: "convert-inches-to-decimal",
    title: "Convert Inches to Decimal",
    description:
      "Professional inches to decimal converter for construction, woodworking, and manufacturing. Convert fractional inches (5 3/4) to decimal inches (5.75) instantly with visual ruler and precision control.",
    icon: Ruler,
    href: "/tools/convert-inches-to-decimal",
    features: [
      "Bidirectional Fraction ↔ Decimal Conversion",
      "Visual Ruler with Measurements",
      "Mobile-Optimized for Job Sites",
      "Conversion History & Export",
    ],
    badge: "Professional",
    badgeColor: "bg-orange-500",
    gradient: gradients.utility,
    category: "Utility",
  },
]

export default toolsData

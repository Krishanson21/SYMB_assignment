# SYMB_assignment
assignment_round
# Smart Parking Lot System

## Features

- Add Parking Slots: Create parking slots with customizable features
- Smart Allocation: Automatically find and allocate the nearest available slot
- Filter by Requirements: Match vehicles to slots based on coverage and EV charging needs
- Visual Management: Modern grid and list views for easy slot monitoring
- Real-time Statistics: Track total, available, and occupied slots
- Persistent Storage: Data saved using localStorage

## Technology Stack

- HTML5: Semantic structure
- CSS3: Modern styling with CSS Grid, Flexbox, and animations
- Vanilla JavaScript: Core logic and DOM manipulation
- LocalStorage API: Data persistence
- Font Awesome: Icon library

##  Data Model

Each parking slot contains:

```javascript
{
  slotNo: string,        // Unique slot identifier (e.g., "A1", "P-101")
  isCovered: boolean,    // Whether the slot has covered parking
  isEVCharging: boolean, // Whether the slot has EV charging station
  isOccupied: boolean    // Current occupancy status
}
```
### 3. Park Vehicle ✓
**ParkVehicle(needsEV, needsCover)**
- Filters slots by requirements
- Allocates nearest available matching slot
- Shows success with slot details
- Displays "No slot available" when no match found

### 4. Remove Vehicle ✓
- Free occupied slots with one click
- Updates all statistics automatically
- Confirms successful removal


##  Usage Guide

### Adding a Parking Slot

1. Enter a unique slot number (e.g., A1, B5, P-101)
2. Check "Covered Parking" if the slot has a roof
3. Check "EV Charging" if the slot has charging station
4. Click "Add Slot"

### Parking a Vehicle

**Method 1: Automatic Allocation**
1. Check requirements (Needs Cover, Needs EV)
2. Click "Find & Park"
3. System allocates nearest matching slot

**Method 2: Manual Selection**
1. Find available slot in the grid
2. Click "Park Here" button on slot card

### Removing a Vehicle

1. Find the occupied slot (marked in red)
2. Click "Free Slot" button
3. Slot becomes available immediately

## Smart Allocation Logic

The system uses intelligent filtering:

1. Filter available slots (isOccupied = false)
2. Apply requirements:
   - If needsEV → filter slots with isEVCharging = true
   - If needsCover → filter slots with isCovered = true
3. Select nearest slot (first matching slot)
4. Mark as occupied and update display


### Code Quality
- Modular JavaScript functions
- Semantic HTML structure
- Organized CSS with CSS variables
- Comprehensive comments
- Consistent naming conventions

---

**Made with 🚗 for smart parking management**

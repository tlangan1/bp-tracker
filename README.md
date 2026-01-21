# Blood Pressure & Pulse Tracker - Web Application

A browser-based application for tracking blood pressure and pulse readings with automatic color coding based on American Heart Association guidelines.

## Features

- **Easy Data Entry**: Record systolic, diastolic, and pulse readings for morning, noon, and night
- **Automatic Color Coding**: Visual indicators based on AHA guidelines

  - Green: Normal range
  - Yellow: Elevated
  - Orange: Stage 1 hypertension
  - Red: Stage 2 hypertension
  - Dark Red: Hypertensive crisis

- **Data Management**:

  - Save/Load from browser's local storage
  - Export readings to text file
  - Import readings from text file
  - Delete individual readings
  - Sort by date

- **Statistics**: View averages and total count of readings

## How to Use

1. **Open the Application**

   - Simply open `index.html` in any modern web browser
   - No server or installation required

2. **Add a Reading**

   - Select the date, time of day, and reading number
   - Enter systolic, diastolic, and pulse values
   - Click "Add Reading"
   - The reading will appear in the table with color coding

3. **Save Your Data**

   - Click "Save Data" to store in browser's local storage
   - Data persists between sessions
   - Click "Load Data" to restore saved data

4. **Export/Import**

   - Export: Creates a text file with all readings
   - Import: Load readings from a previously exported text file

5. **View Statistics**
   - Automatic calculation of averages
   - Total reading count

## Color Guide

### Blood Pressure

- **Green**: Normal < 120 and < 80
- **Yellow**: Elevated 120-129 and < 80
- **Orange**: Stage 1 130-139 or 80-89
- **Red**: Stage 2 140-179 or 90-119
- **Dark Red**: Crisis ≥ 180 and/or ≥ 120

<table class="table table-responsive table-striped"><caption class="hiddentext" style="visibility: hidden;">Blood Pressure Categories Chart</caption> <thead><tr style="color: rgb(255, 255, 255); background-color: rgb(76, 80, 81); font-size: 0.9rem;"><th scope="col"><span class="text-uppercase">BLOOD PRESSURE CATEGORY</span></th> <th scope="col"><span class="text-uppercase">SYSTOLIC</span> mm Hg (top/upper number)</th> <th scope="col">and/or</th> <th scope="col"><span class="text-uppercase">DIASTOLIC</span> mm Hg (bottom/lower number)</th></tr></thead> <tbody><tr style="color: rgb(0, 0, 0); background-color: rgb(166, 206, 57); font-size: 0.9rem;"><th scope="row"><span class="text-uppercase">NORMAL</span></th> <td data-label="SYSTOLIC mm Hg (upper number)"><span class="text-uppercase">LESS THAN</span> 120</td> <td data-label="and/or">and</td> <td data-label="DIASTOLIC mm Hg (lower number)"><span class="text-uppercase">LESS THAN</span> 80</td></tr> <tr style="color: rgb(0, 0, 0); background-color: rgb(255, 236, 0); font-size: 0.9rem;"><th scope="row"><span class="text-uppercase">ELEVATED</span></th> <td data-label="SYSTOLIC mm Hg (upper number)">120 – 129</td> <td data-label="and/or">and</td> <td data-label="DIASTOLIC mm Hg (lower number)"><span class="text-uppercase">LESS THAN</span> 80</td></tr> <tr style="color: rgb(0, 0, 0); background-color: rgb(255, 182, 0); font-size: 0.9rem;"><th scope="row"><span class="text-uppercase">STAGE 1 HYPERTENSION</span> (High Blood Pressure)</th> <td data-label="SYSTOLIC mm Hg (upper number)">130 – 139</td> <td data-label="and/or">or</td> <td data-label="DIASTOLIC mm Hg (lower number)">80 – 89</td></tr> <tr style="color: rgb(255, 255, 255); background-color: rgb(186, 58, 2); font-size: 0.9rem;"><th scope="row"><span class="text-uppercase">STAGE 2 HYPERTENSION</span> (High Blood Pressure)</th> <td data-label="SYSTOLIC mm Hg (upper number)">140 <span class="text-uppercase">OR HIGHER</span></td> <td data-label="and/or">or</td> <td data-label="DIASTOLIC mm Hg (lower number)">90 <span class="text-uppercase">OR HIGHER</span></td></tr> <tr style="color: rgb(255, 255, 255); background-color: rgb(153, 7, 17); font-size: 0.9rem;"><th scope="row"><span class="text-uppercase">SEVERE HYPERTENSION</span> (If you don’t have symptoms*, call your health care professional.)</th> <td data-label="SYSTOLIC mm Hg (upper number)"><span class="text-uppercase">HIGHER THAN</span> 180</td> <td data-label="and/or">and/or</td> <td data-label="DIASTOLIC mm Hg (lower number)"><span class="text-uppercase">HIGHER THAN</span> 120</td></tr> <tr style="color: rgb(255, 255, 255); background-color: rgb(139, 0, 64); font-size: 0.9rem;"><th scope="row"><a href="/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/when-to-call-911-for-high-blood-pressure" style="color: rgb(255, 255, 255); text-decoration: underline;"><span class="text-uppercase">HYPERTENSIVE EMERGENCY</span></a>&nbsp;(If you have any of these symptoms*, call 911.)</th> <td data-label="SYSTOLIC mm Hg (upper number)"><span class="text-uppercase">HIGHER THAN</span> 180</td> <td data-label="and/or">and/or</td> <td data-label="DIASTOLIC mm Hg (lower number)"><span class="text-uppercase">HIGHER THAN</span> 120</td></tr> <tr style="color: rgb(0, 0, 0); background-color: rgb(248, 248, 248); font-size: 1rem;"><td colspan="4"><strong>*symptoms: chest pain, shortness of breath, back pain, numbness, weakness, change in vision or difficulty speaking</strong></td></tr></tbody></table>

### Pulse

- **White with Red Text**: Very low (<57)
- **Dark Blue**: Low (57-61)
- **Blue**: Below normal (62-67)
- **Dark Green**: Good (68-71)
- **Green**: Normal (72-75)
- **Yellow**: Elevated (76-81)
- **Red**: High (≥82)

## File Format

The exported text file uses tab-separated values:

```
Date    Time    Reading    Systolic    Diastolic    Pulse
2023-12-26    morning    1    120    80    72
```

## Browser Compatibility

Works in all modern browsers:

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Data Storage

- Data is stored in browser's localStorage
- No data is sent to any server
- Data persists until you clear browser data
- Export to file for backup

## Privacy

All data stays on your device. Nothing is transmitted over the internet.

## Converting from Excel/LibreOffice

This application replicates the functionality of the Excel VBA workbook, using the same color-coding logic from the original macros.

## Technical Details

- Pure HTML/CSS/JavaScript
- No external dependencies
- Responsive design for mobile devices
- Color coding matches the original VBA implementation

## Support

For issues or questions, refer to the original VBA conversion guidelines in `VBA_to_LibreOffice_Conversion_Guidelines.txt`.

## Security Certificate

Below is the mkcert command to create the security certificate and the associated output.

```
langan@Tom-Primary-Linux /media/tlangan/ext4 XHD/Computer Science/excel-to-libre-calc/bp-tracker$ cd "/media/tlangan/ext4 XHD/Computer Science/excel-to-libre-calc/bp-tracker" && mkcert localhost 127.0.0.1 ::1 192.168.1.79

Created a new certificate valid for the following names 📜
 - "localhost"
 - "127.0.0.1"
 - "::1"
 - "192.168.1.79"

The certificate is at "./localhost+3.pem" and the key at "./localhost+3-key.pem" ✅

It will expire on 27 March 2028 🗓
```

Note, I renamed the files to 192.168.1.79.pem and 192.168.1.79-key.pem.

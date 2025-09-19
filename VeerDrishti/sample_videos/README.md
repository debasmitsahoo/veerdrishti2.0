# Sample Videos Directory

This directory contains sample video files for the VeerDrishti threat detection system.

## Required Files

### demo1.mp4
- **Location**: `/sample_videos/demo1.mp4`
- **Duration**: 10-30 seconds recommended
- **Content**: Any video with people, vehicles, or objects that can be detected
- **Format**: MP4 (H.264 codec preferred)

## How to Add Your Video

1. **Record a short video** (10-30 seconds) with:
   - People walking or moving
   - Vehicles (cars, trucks, motorcycles)
   - Any objects that might be detected as threats

2. **Save the video as `demo1.mp4`** in this directory

3. **Alternative sources**:
   - Use any existing MP4 video file
   - Download sample videos from the internet
   - Record using your phone or camera

## Video Requirements

- **Format**: MP4
- **Duration**: 10-30 seconds (will loop automatically)
- **Resolution**: Any resolution (will be scaled to fit)
- **Content**: Should contain moving objects for detection

## Fallback Behavior

If no video is provided:
- The system will show a placeholder message
- Detection will still work with motion detection fallback
- The dashboard will remain functional

## Example Video Sources

- Security camera footage
- Street surveillance videos
- Military training videos
- Any video with people and vehicles

## Troubleshooting

If the video doesn't load:
1. Check file format (must be MP4)
2. Ensure file is named exactly `demo1.mp4`
3. Verify file is in the correct directory
4. Check browser console for errors

The system will work without a video file, but having one improves the demo experience.

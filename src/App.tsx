import React, { useState, useRef, useEffect } from 'react'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Monitor,
  Eye,
  EyeOff,
  RotateCcw,
  Upload,
  FileText,
  Clock,
  Users,
  HelpCircle
} from 'lucide-react'

interface TeleprompterScript {
  id: string
  title: string
  content: string
  estimatedTime: string
  description: string
}

const defaultScripts: TeleprompterScript[] = [
  {
    id: '1',
    title: 'Introduction video',
    description: 'Introduce yourself and present key points about your career.',
    content: `Welcome! I'm excited to share a bit about myself and my professional journey with you.

My name is [Your Name], and I bring [X years] of experience in [Your Field/Industry]. Throughout my career, I've been passionate about [Key Interest/Specialty].

Here are the key highlights of my professional background:

• [Achievement/Experience 1] - This experience taught me [Key Learning]
• [Achievement/Experience 2] - Where I developed skills in [Relevant Skills]  
• [Achievement/Experience 3] - Leading to [Positive Outcome/Impact]

What drives me professionally is [Your Motivation/Values]. I'm particularly excited about opportunities that allow me to [Your Goals/Interests].

I'm looking forward to discussing how my background and enthusiasm can contribute to your team's success.

Thank you for your time and consideration!`,
    estimatedTime: '1 min'
  },
  {
    id: '2',
    title: 'Experience & Background',
    description: 'Walk through your professional experience and key achievements.',
    content: `Let me walk you through my professional journey and the experiences that have shaped my career.

I started my career in [Starting Role/Company] where I [Key Responsibility/Achievement]. This foundation taught me [Important Skills/Values].

Over the past [Time Period], I've progressed through roles that have expanded my expertise:

At [Company/Role], I:
• [Specific Achievement with measurable impact]
• [Key project or responsibility]
• [Skills developed or demonstrated]

My most significant professional achievement was [Major Achievement]. This experience was meaningful because [Why it mattered/Impact].

To stay current in my field, I:
• [Learning method 1 - courses, certifications, etc.]
• [Learning method 2 - industry involvement, networking]
• [Learning method 3 - personal projects, reading]

I perform best in environments that are [Work Environment Preferences] because [Reasoning].

This combination of experience, continuous learning, and self-awareness has prepared me to make a strong contribution to your organization.`,
    estimatedTime: '5-7 min'
  },
  {
    id: '3',
    title: 'Closing & Next Steps',
    description: 'Wrap up the interview and discuss next steps.',
    content: `As we wrap up our conversation today, I want to thank you for this opportunity to share my background and learn more about this role.

Before we conclude, I'd love to address any questions you might have:

• About my experience or qualifications
• Regarding my approach to [Relevant Work Area]
• Concerning how I would handle [Relevant Challenge/Situation]
• About my interest in this role and your organization

I'm also curious to learn more about:
• The team I'd be working with
• Key priorities for this role in the first 90 days
• Your company culture and growth opportunities
• What success looks like in this position

Is there anything else I should know about the role or your organization that would help me understand how I can best contribute?

I'm very excited about the possibility of joining your team and contributing to [Company/Team Goals]. 

Thank you again for your time and thoughtful questions. I look forward to hearing about the next steps in your process.

Have a wonderful rest of your day!`,
    estimatedTime: '2-3 min'
  }
]

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [showTeleprompter, setShowTeleprompter] = useState(false)
  const [selectedScript, setSelectedScript] = useState(defaultScripts[0])
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(50)
  const [isScrolling, setIsScrolling] = useState(false)
  const [customScript, setCustomScript] = useState('')
  const [showCustomEditor, setShowCustomEditor] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const teleprompterRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()
  const scrollIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    getUserMedia()
  }, [])

  useEffect(() => {
    if (isScrolling && teleprompterRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += 1
        }
      }, 101 - teleprompterSpeed)
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [isScrolling, teleprompterSpeed])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const handlePauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const handleTeleprompterToggle = () => {
    setIsScrolling(!isScrolling)
  }

  const resetTeleprompter = () => {
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0
    }
    setIsScrolling(false)
  }

  const handleScriptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCustomScript(content)
        setShowCustomEditor(true)
      }
      reader.readAsText(file)
    }
  }

  const saveCustomScript = () => {
    const newScript: TeleprompterScript = {
      id: Date.now().toString(),
      title: 'Custom Script',
      description: 'Your custom script content',
      content: customScript,
      estimatedTime: 'Variable'
    }
    setSelectedScript(newScript)
    setShowCustomEditor(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-semibold text-white">{selectedScript.title}</h1>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-10 h-10 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors"
        >
          <HelpCircle className="w-6 h-6 text-purple-900" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-white text-lg font-mono">
              .{formatTime(recordingTime).replace(':', '')}
            </div>
          </div>

          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden mb-8" style={{ aspectRatio: '3/4' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              className={`w-full h-full object-cover ${!isVideoOn ? 'opacity-0' : ''}`}
            />
            
            {!isVideoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-2 rounded-full transition-colors ${
                  isVideoOn 
                    ? 'bg-green-500/80 text-white hover:bg-green-500' 
                    : 'bg-red-500/80 text-white hover:bg-red-500'
                }`}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-2 rounded-full transition-colors ${
                  isAudioOn 
                    ? 'bg-green-500/80 text-white hover:bg-green-500' 
                    : 'bg-red-500/80 text-white hover:bg-red-500'
                }`}
              >
                {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Script Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="text-white">
                <div className="text-lg font-medium mb-2">
                  0. {selectedScript.description}
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{selectedScript.estimatedTime} | unlimited takes</span>
                </div>
              </div>
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-2 bg-red-500/90 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {isPaused ? 'PAUSED' : 'RECORDING'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="text-center mb-8">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Start recording
              </button>
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePauseRecording}
                  className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleStopRecording}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <Square className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Teleprompter Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowTeleprompter(!showTeleprompter)}
              className="text-white/80 hover:text-white flex items-center mx-auto space-x-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{showTeleprompter ? 'Hide' : 'Show'} Teleprompter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teleprompter Panel */}
      {showTeleprompter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-purple-900 rounded-2xl border border-purple-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Teleprompter
                </h2>
                <button
                  onClick={() => setShowTeleprompter(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Script Selection */}
                <div>
                  <label className="block text-sm text-purple-200 mb-2">Select Script</label>
                  <select
                    value={selectedScript.id}
                    onChange={(e) => {
                      const script = defaultScripts.find(s => s.id === e.target.value)
                      if (script) setSelectedScript(script)
                    }}
                    className="w-full bg-purple-800 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    {defaultScripts.map(script => (
                      <option key={script.id} value={script.id} className="bg-purple-800">
                        {script.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speed Control */}
                <div>
                  <label className="block text-sm text-purple-200 mb-2">
                    Scroll Speed: {teleprompterSpeed}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={teleprompterSpeed}
                    onChange={(e) => setTeleprompterSpeed(Number(e.target.value))}
                    className="w-full accent-yellow-400"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex space-x-2">
                  <button
                    onClick={handleTeleprompterToggle}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isScrolling
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isScrolling ? (
                      <>
                        <Pause className="w-4 h-4 inline mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 inline mr-1" />
                        Start
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetTeleprompter}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-1" />
                    Reset
                  </button>
                </div>

                <div className="flex space-x-2">
                  <label className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Script
                    <input
                      type="file"
                      accept=".txt,.md"
                      onChange={handleScriptUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setShowCustomEditor(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit Script
                  </button>
                </div>
              </div>
            </div>

            {/* Teleprompter Content */}
            <div className="flex-1 overflow-hidden">
              <div
                ref={teleprompterRef}
                className="h-full overflow-y-auto p-6 text-white leading-relaxed"
                style={{ fontSize: '20px', lineHeight: '1.8' }}
              >
                <div className="whitespace-pre-wrap max-w-3xl mx-auto">
                  {selectedScript.content}
                </div>
                <div className="h-96"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Script Editor Modal */}
      {showCustomEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-purple-900 rounded-2xl border border-purple-700 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-purple-700">
              <h3 className="text-xl font-semibold text-white">Custom Script Editor</h3>
            </div>
            <div className="flex-1 p-6">
              <textarea
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                placeholder="Enter your custom script here..."
                className="w-full h-64 bg-purple-800 border border-purple-600 rounded-lg p-4 text-white resize-none"
              />
            </div>
            <div className="p-6 border-t border-purple-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomEditor(false)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomScript}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-purple-900 rounded-lg transition-colors"
              >
                Save Script
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-purple-900 rounded-2xl border border-purple-700 w-full max-w-md">
            <div className="p-6 border-b border-purple-700">
              <h3 className="text-xl font-semibold text-white">Recording Tips</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-purple-100">
                <div>
                  <h4 className="font-medium text-white mb-1">Before Recording:</h4>
                  <p className="text-sm">• Check your camera and microphone</p>
                  <p className="text-sm">• Ensure good lighting on your face</p>
                  <p className="text-sm">• Review your script using the teleprompter</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">During Recording:</h4>
                  <p className="text-sm">• Look directly at the camera</p>
                  <p className="text-sm">• Speak clearly and at a steady pace</p>
                  <p className="text-sm">• Take your time - you have unlimited takes</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Teleprompter:</h4>
                  <p className="text-sm">• Adjust scroll speed to match your reading pace</p>
                  <p className="text-sm">• Use the pause/play controls as needed</p>
                  <p className="text-sm">• Upload your own script or edit the default ones</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-purple-700">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 py-2 rounded-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

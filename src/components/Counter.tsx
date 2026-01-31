import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square, RotateCcw, Settings, ChevronDown } from "lucide-react";

const Counter = () => {
  const [targetNumber, setTargetNumber] = useState<string>("100");
  const [fps, setFps] = useState<number>(33);
  const [fpsInput, setFpsInput] = useState<string>("33");
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const countRef = useRef<number>(0);

  const handleFpsChange = (value: string) => {
    setFpsInput(value);
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 120) {
      setFps(parsed);
    }
  };

  const startCounting = useCallback(() => {
    const target = parseInt(targetNumber, 10);
    if (isNaN(target) || target <= 0) return;

    setIsRunning(true);
    setIsComplete(false);
    countRef.current = 0;
    setCurrentCount(0);

    const frameInterval = 1000 / fps;
    let lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;
      
      if (elapsed >= frameInterval) {
        lastFrameTime = currentTime - (elapsed % frameInterval);
        countRef.current += 1;
        setCurrentCount(countRef.current);
        
        if (countRef.current >= target) {
          setCurrentCount(target);
          setIsRunning(false);
          setIsComplete(true);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [targetNumber, fps]);

  const stopCounting = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const resetCounter = useCallback(() => {
    stopCounting();
    setCurrentCount(0);
    setIsComplete(false);
    countRef.current = 0;
  }, [stopCounting]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-10">
      {/* Header - simplified */}
      <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center">
        🔢 Let's Count!
      </h1>

      {/* Counter Display */}
      <div className="relative">
        <div 
          className={`counter-display text-7xl md:text-9xl font-bold transition-colors duration-200 ${
            isComplete ? "text-primary" : isRunning ? "text-primary" : "text-foreground"
          }`}
        >
          {formatNumber(currentCount)}
        </div>
        {isComplete && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary text-2xl font-bold animate-pulse">
            🎉 Done!
          </div>
        )}
      </div>

      {/* Controls - simplified */}
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <Input
          type="number"
          value={targetNumber}
          onChange={(e) => setTargetNumber(e.target.value)}
          placeholder="Type a number..."
          disabled={isRunning}
          className="text-center text-2xl h-16 bg-input border-border input-glow transition-shadow duration-300"
          min="1"
        />

        <div className="flex gap-3">
          {!isRunning ? (
            <Button
              onClick={startCounting}
              size="lg"
              className="gap-2 px-10 h-14 text-xl font-bold counter-glow"
              disabled={!targetNumber || parseInt(targetNumber) <= 0}
            >
              <Play className="w-6 h-6" />
              Go!
            </Button>
          ) : (
            <Button
              onClick={stopCounting}
              size="lg"
              variant="secondary"
              className="gap-2 px-10 h-14 text-xl font-bold"
            >
              <Square className="w-6 h-6" />
              Stop
            </Button>
          )}
          
          <Button
            onClick={resetCounter}
            size="lg"
            variant="outline"
            className="h-14 px-6"
            disabled={isRunning && currentCount === 0}
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>

        {/* Simple Toggle Settings */}
        <div className="w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Settings className="w-4 h-4" />
            Settings
            <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
          </Button>
          
          {settingsOpen && (
            <div className="mt-3 flex items-center gap-3 justify-center">
              <label className="text-sm text-muted-foreground">Speed:</label>
              <Input
                type="number"
                value={fpsInput}
                onChange={(e) => handleFpsChange(e.target.value)}
                disabled={isRunning}
                className="w-20 text-center h-9"
                min="1"
                max="120"
              />
              <span className="text-sm text-muted-foreground">fps</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Counter;

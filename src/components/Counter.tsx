import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Settings, ChevronDown } from "lucide-react";

const Counter = () => {
  const [targetNumber, setTargetNumber] = useState<string>("100");
  const [displayValue, setDisplayValue] = useState<string>("100");
  const [fps, setFps] = useState<number>(33);
  const [fpsInput, setFpsInput] = useState<string>("33");
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const countRef = useRef<number>(0);

  const formatWithCommas = (value: string): string => {
    const num = value.replace(/,/g, "").replace(/\D/g, "");
    if (!num) return "";
    return parseInt(num, 10).toLocaleString();
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "" || /^\d+$/.test(raw)) {
      setTargetNumber(raw);
      setDisplayValue(formatWithCommas(raw));
    }
  };

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
    setIsPaused(false);
    setIsComplete(false);
    
    // Only reset if not resuming from pause
    if (countRef.current === 0) {
      setCurrentCount(0);
    }

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

  const pauseCounting = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resetCounter = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setCurrentCount(0);
    setIsComplete(false);
    countRef.current = 0;
  }, []);

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
    <div className="flex flex-col items-center justify-start min-h-[100dvh] p-4 pt-8 md:pt-0 md:justify-center gap-4 md:gap-10">
      {/* Header - simplified */}
      <h1 className="text-2xl md:text-5xl font-bold text-foreground text-center">
        🔢 Let's Count!
      </h1>

      {/* Counter Display */}
      <div className="relative">
        <div 
          className={`counter-display text-5xl md:text-9xl font-bold transition-colors duration-200 ${
            isComplete ? "text-primary" : isRunning ? "text-primary" : "text-foreground"
          }`}
        >
          {formatNumber(currentCount)}
        </div>
        {isComplete && (
          <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 text-primary text-xl md:text-2xl font-bold animate-pulse">
            🎉 Done!
          </div>
        )}
      </div>

      {/* Controls - simplified */}
      <div className="flex flex-col items-center gap-3 md:gap-6 w-full max-w-lg">
        <div className="flex gap-2 w-full items-center justify-center flex-wrap">
          <div className="relative inline-flex items-center">
            <span className="invisible text-xl md:text-2xl px-3 py-2 whitespace-pre">
              {displayValue || "000"}
            </span>
            <Input
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleTargetChange}
              placeholder="100"
              disabled={isRunning || isPaused}
              className="absolute inset-0 text-center text-xl md:text-2xl h-12 md:h-16 bg-input border-border input-glow transition-shadow duration-300 min-w-[80px]"
            />
          </div>
          {!isRunning ? (
            <Button
              onClick={startCounting}
              size="lg"
              className="gap-1 md:gap-2 px-4 md:px-10 h-12 md:h-16 text-lg md:text-xl font-bold counter-glow"
              disabled={!targetNumber || parseInt(targetNumber) <= 0}
            >
              <Play className="w-5 h-5 md:w-6 md:h-6" />
              {isPaused ? "Resume" : "Go!"}
            </Button>
          ) : (
            <Button
              onClick={pauseCounting}
              size="lg"
              variant="secondary"
              className="gap-1 md:gap-2 px-4 md:px-10 h-12 md:h-16 text-lg md:text-xl font-bold"
            >
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
              Pause
            </Button>
          )}
          <Button
            onClick={resetCounter}
            size="lg"
            variant="outline"
            className="h-12 md:h-16 px-3 md:px-6"
            disabled={currentCount === 0 && !isPaused}
          >
            <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
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

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Play, Square, RotateCcw } from "lucide-react";

const Counter = () => {
  const [targetNumber, setTargetNumber] = useState<string>("1000");
  const [fps, setFps] = useState<number>(33);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const countRef = useRef<number>(0);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Number Counter
        </h1>
        <p className="text-muted-foreground text-lg">
          Enter a number and watch it count up
        </p>
      </div>

      {/* Counter Display */}
      <div className="relative">
        <div 
          className={`counter-display text-6xl md:text-8xl lg:text-9xl font-bold transition-colors duration-200 ${
            isComplete ? "text-primary" : isRunning ? "text-primary" : "text-foreground"
          }`}
        >
          {formatNumber(currentCount)}
        </div>
        {isComplete && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-primary text-sm font-medium animate-pulse">
            Complete!
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="target" className="text-sm text-muted-foreground font-medium">
            Count up to:
          </label>
          <Input
            id="target"
            type="number"
            value={targetNumber}
            onChange={(e) => setTargetNumber(e.target.value)}
            placeholder="Enter a number..."
            disabled={isRunning}
            className="text-center text-xl h-14 bg-input border-border input-glow transition-shadow duration-300"
            min="1"
          />
        </div>

        {/* FPS Setting */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex justify-between items-center">
            <label className="text-sm text-muted-foreground font-medium">
              Speed (FPS):
            </label>
            <span className="text-sm font-mono text-foreground">{fps} fps</span>
          </div>
          <Slider
            value={[fps]}
            onValueChange={(value) => setFps(value[0])}
            min={1}
            max={120}
            step={1}
            disabled={isRunning}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 fps</span>
            <span>120 fps</span>
          </div>
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <Button
              onClick={startCounting}
              size="lg"
              className="gap-2 px-8 h-12 text-lg font-semibold counter-glow"
              disabled={!targetNumber || parseInt(targetNumber) <= 0}
            >
              <Play className="w-5 h-5" />
              Start
            </Button>
          ) : (
            <Button
              onClick={stopCounting}
              size="lg"
              variant="secondary"
              className="gap-2 px-8 h-12 text-lg font-semibold"
            >
              <Square className="w-5 h-5" />
              Stop
            </Button>
          )}
          
          <Button
            onClick={resetCounter}
            size="lg"
            variant="outline"
            className="gap-2 px-6 h-12"
            disabled={isRunning && currentCount === 0}
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Info */}
      <p className="text-muted-foreground text-sm text-center max-w-md">
        Counting at {fps} fps. Time to count to {parseInt(targetNumber) || 0}: ~{((parseInt(targetNumber) || 0) / fps).toFixed(1)}s
      </p>
    </div>
  );
};

export default Counter;

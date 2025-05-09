// Save system for Slap Battler Clicker
class GameSave {
    constructor() {
        this.saveKey = 'slapBattlerSave';
        this.autoSaveInterval = 30000; // 30 seconds
        this.initAutoSave();
    }

    // Save all game data
    saveGame() {
        const saveData = {
            // Base game data
            slaps: window.slaps,
            totalSlaps: window.totalSlaps,
            slapsPerClick: window.slapsPerClick,
            slapsPerSecond: window.slapsPerSecond,
            nullCrystals: window.nullCrystals,
            totalCrystals: window.totalCrystals,
            chestsOpened: window.chestsOpened,
            megaChestsOpened: window.megaChestsOpened,
            wallsBroken: window.wallsBroken,
            plagueSlaps: window.plagueSlaps,
            bossFightsWon: window.bossFightsWon,
            currentKillstreak: window.currentKillstreak,
            highestKillstreak: window.highestKillstreak,
            replicaClicks: window.replicaClicks,
            blackSquaresFound: window.blackSquaresFound,
            
            // Upgrades
            upgrades: window.upgrades,
            
            // Gloves and abilities
            selectedGlove: window.selectedGlove,
            abilityCooldown: window.abilityCooldown,
            stoneTime: window.stoneTime,
            ghostTime: window.ghostTime,
            bobTime: window.bobTime,
            isStone: window.isStone,
            isGhost: window.isGhost,
            isBob: window.isBob,
            randomBuffActive: window.randomBuffActive,
            randomBuffType: window.randomBuffType,
            randomBuffEndTime: window.randomBuffEndTime,
            pullHoldStart: window.pullHoldStart,
            pullHoldActive: window.pullHoldActive,
            plagueActive: window.plagueActive,
            plagueEndTime: window.plagueEndTime,
            wallActive: window.wallActive,
            wallHits: window.wallHits,
            wallEndTime: window.wallEndTime,
            
            // Achievements
            achievements: window.achievements,
            unlockedGloves: window.unlockedGloves,
            
            // Skins
            unlockedSkins: window.unlockedSkins,
            currentSkin: window.currentSkin,
            
            // Timestamp for when the game was saved
            lastSave: Date.now()
        };
        
        localStorage.setItem(this.saveKey, JSON.stringify(saveData));
        console.log('Game saved!');
    }

    // Load saved game data
    loadGame() {
        const savedData = localStorage.getItem(this.saveKey);
        if (!savedData) return false;
        
        try {
            const parsedData = JSON.parse(savedData);
            
            // Base game data
            window.slaps = parsedData.slaps || 0;
            window.totalSlaps = parsedData.totalSlaps || 0;
            window.slapsPerClick = parsedData.slapsPerClick || 1;
            window.slapsPerSecond = parsedData.slapsPerSecond || 0;
            window.nullCrystals = parsedData.nullCrystals || 0;
            window.totalCrystals = parsedData.totalCrystals || 0;
            window.chestsOpened = parsedData.chestsOpened || 0;
            window.megaChestsOpened = parsedData.megaChestsOpened || 0;
            window.wallsBroken = parsedData.wallsBroken || 0;
            window.plagueSlaps = parsedData.plagueSlaps || 0;
            window.bossFightsWon = parsedData.bossFightsWon || 0;
            window.currentKillstreak = parsedData.currentKillstreak || 0;
            window.highestKillstreak = parsedData.highestKillstreak || 0;
            window.replicaClicks = parsedData.replicaClicks || 0;
            window.blackSquaresFound = parsedData.blackSquaresFound || 0;
            
            // Upgrades
            window.upgrades = parsedData.upgrades || {
                double: false,
                fiveTimes: false,
                plusFivePerSec: false,
                plusTwentyPerSec: false,
                tenTimes: false
            };
            
            // Gloves and abilities
            window.selectedGlove = parsedData.selectedGlove || 'default';
            window.abilityCooldown = parsedData.abilityCooldown || 0;
            window.stoneTime = parsedData.stoneTime || 0;
            window.ghostTime = parsedData.ghostTime || 0;
            window.bobTime = parsedData.bobTime || 0;
            window.isStone = parsedData.isStone || false;
            window.isGhost = parsedData.isGhost || false;
            window.isBob = parsedData.isBob || false;
            window.randomBuffActive = parsedData.randomBuffActive || false;
            window.randomBuffType = parsedData.randomBuffType || '';
            window.randomBuffEndTime = parsedData.randomBuffEndTime || 0;
            window.pullHoldStart = parsedData.pullHoldStart || 0;
            window.pullHoldActive = parsedData.pullHoldActive || false;
            window.plagueActive = parsedData.plagueActive || false;
            window.plagueEndTime = parsedData.plagueEndTime || 0;
            window.wallActive = parsedData.wallActive || false;
            window.wallHits = parsedData.wallHits || 0;
            window.wallEndTime = parsedData.wallEndTime || 0;
            
            // Achievements
            window.achievements = parsedData.achievements || {
                stoneAge: false,
                doubleDefault: false,
                pull: false,
                trueGhost: false,
                plague: false,
                trueMaster: false,
                eye: false,
                bob: false,
                twoFifty: false
            };
            
            window.unlockedGloves = parsedData.unlockedGloves || {
                stoneAge: false,
                doubleDefault: false,
                pull: false,
                voodoo: false,
                bob: false
            };
            
            // Skins
            window.unlockedSkins = parsedData.unlockedSkins || [];
            window.currentSkin = parsedData.currentSkin || null;
            
            // Calculate offline progress (in seconds)
            const offlineTime = Math.floor((Date.now() - (parsedData.lastSave || Date.now())) / 1000);
            if (offlineTime > 0) {
                const offlineSlaps = Math.floor(offlineTime * window.slapsPerSecond);
                if (offlineSlaps > 0) {
                    window.slaps += offlineSlaps;
                    window.totalSlaps += offlineSlaps;
                    alert(`Welcome back! You earned ${offlineSlaps.toLocaleString()} slaps while you were away!`);
                }
            }
            
            console.log('Game loaded!');
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }

    // Initialize auto-save
    initAutoSave() {
        setInterval(() => this.saveGame(), this.autoSaveInterval);
    }

    // Reset all game data
    resetGame() {
        localStorage.removeItem(this.saveKey);
        console.log('Game reset!');
    }
}

// Initialize save system when the script loads
const gameSave = new GameSave();

// Add to global scope
window.saveGame = () => gameSave.saveGame();
window.loadGame = () => gameSave.loadGame();
window.resetGame = () => gameSave.resetGame();

// Export for Node.js environment (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameSave;
}

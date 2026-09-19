import React, { useState, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import FlashCardView from './components/FlashCardView';
import SpellingQuizView from './components/SpellingQuizView';
import EbbinghausView from './components/EbbinghausView';
import DeckManager from './components/DeckManager';
import StatsView from './components/StatsView';
import ImportExportModal from './components/ImportExportModal';
import CardEditModal from './components/CardEditModal';

import { loadDecks, saveCustomDecks, loadSettings, saveSettings, loadTheme, saveTheme } from './utils/storage';
import { calculateNextReview, getDueReviewCards } from './utils/ebbinghaus';

export default function App() {
  const [decks, setDecks] = useState(() => loadDecks());
  const [activeDeckId, setActiveDeckId] = useState(() => decks[0]?.id || 'preset_cet4');
  const [activeView, setActiveView] = useState('cards'); // 'cards' | 'quiz' | 'ebbinghaus' | 'manage' | 'stats'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'learning' | 'mastered'
  const [darkMode, setDarkMode] = useState(() => loadTheme() === 'dark');
  
  // Settings & Card Order
  const [settings, setSettings] = useState(() => loadSettings());
  const [autoAudio, setAutoAudio] = useState(settings.autoPlayAudio);
  const [cardOrder, setCardOrder] = useState('en-zh'); // 'en-zh' (英->中) | 'zh-en' (中->英)
  const [groupSize, setGroupSize] = useState(5);       // Group size: 5, 10, 15, 20

  // Quiz Mode state
  const [quizCards, setQuizCards] = useState([]);
  const [quizGroupIndex, setQuizGroupIndex] = useState(0);
  const [quizTotalGroups, setQuizTotalGroups] = useState(1);

  // Modals
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isCardEditOpen, setIsCardEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Sync dark mode HTML class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Sync settings
  useEffect(() => {
    setSettings(prev => {
      const updated = { ...prev, autoPlayAudio: autoAudio };
      saveSettings(updated);
      return updated;
    });
  }, [autoAudio]);

  // Save custom decks whenever decks state updates
  useEffect(() => {
    saveCustomDecks(decks);
  }, [decks]);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];

  // Calculate Ebbinghaus due cards count
  let allCards = [];
  decks.forEach(d => allCards.push(...d.cards));
  const dueReviewCards = getDueReviewCards(allCards);

  // Filter active deck cards based on filterMode
  const activeDeckCards = activeDeck ? activeDeck.cards.filter(c => {
    if (filterMode === 'mastered') return c.mastered;
    if (filterMode === 'learning') return !c.mastered;
    return true;
  }) : [];

  // Card Mastery & Ebbinghaus SRS Update
  const handleUpdateCardMastery = (cardId, isCorrect) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        return {
          ...deck,
          cards: deck.cards.map(card => {
            if (card.id === cardId) {
              return calculateNextReview(card, isCorrect);
            }
            return card;
          })
        };
      }
      return deck;
    }));
  };

  // Reset Deck Progress
  const handleResetDeckProgress = () => {
    if (!confirm(`确定要重置【${activeDeck?.name}】的所有卡片复习进度吗？`)) return;

    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        return {
          ...deck,
          cards: deck.cards.map(c => ({
            ...c,
            mastered: false,
            reviewCount: 0,
            ebbinghausStage: 0,
            nextReviewDate: null
          }))
        };
      }
      return deck;
    }));
  };

  // Trigger Group Spelling Quiz
  const handleStartGroupQuiz = (groupCards, groupIdx, totalGroups) => {
    setQuizCards(groupCards);
    setQuizGroupIndex(groupIdx);
    setQuizTotalGroups(totalGroups);
    setActiveView('quiz');
  };

  // Complete Group Quiz
  const handleCompleteQuiz = (completedCards) => {
    // Update all cards in quiz with Ebbinghaus progress
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        return {
          ...deck,
          cards: deck.cards.map(c => {
            if (completedCards.some(qc => qc.id === c.id)) {
              return calculateNextReview(c, true);
            }
            return c;
          })
        };
      }
      return deck;
    }));
  };

  // Start Ebbinghaus Review Mode
  const handleStartEbbinghausReview = (dueCards) => {
    setQuizCards(dueCards);
    setQuizGroupIndex(0);
    setQuizTotalGroups(1);
    setActiveView('quiz');
  };

  // Create New Custom Deck
  const handleCreateNewDeck = () => {
    const name = prompt('请输入新自选词库的名称：');
    if (!name || !name.trim()) return;

    const newDeck = {
      id: 'custom_' + Date.now(),
      name: name.trim(),
      description: '自定义建立的精选词库',
      isPreset: false,
      cards: []
    };

    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
  };

  // Delete Custom Deck
  const handleDeleteDeck = (deckId) => {
    const target = decks.find(d => d.id === deckId);
    if (!target) return;
    if (confirm(`确定要彻底删除自定义词库【${target.name}】吗？`)) {
      setDecks(prev => prev.filter(d => d.id !== deckId));
      if (activeDeckId === deckId) {
        setActiveDeckId(decks[0]?.id || 'preset_cet4');
      }
    }
  };

  // Save Single Card
  const handleSaveCard = (cardData) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        const exists = deck.cards.some(c => c.id === cardData.id);
        const updatedCards = exists
          ? deck.cards.map(c => c.id === cardData.id ? cardData : c)
          : [cardData, ...deck.cards];
        return { ...deck, cards: updatedCards };
      }
      return deck;
    }));
  };

  // Delete Single Card
  const handleDeleteCard = (cardId) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        return { ...deck, cards: deck.cards.filter(c => c.id !== cardId) };
      }
      return deck;
    }));
  };

  // Bulk Delete Cards
  const handleDeleteMultipleCards = (cardIds) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        return { ...deck, cards: deck.cards.filter(c => !cardIds.includes(c.id)) };
      }
      return deck;
    }));
  };

  // Toggle Single Card Mastery in Table
  const handleToggleCardMastery = (cardId) => {
    setDecks(prevDecks => prevDecks.map(deck => {
      if (deck.id === activeDeckId) {
        return {
          ...deck,
          cards: deck.cards.map(c => c.id === cardId ? calculateNextReview(c, !c.mastered) : c)
        };
      }
      return deck;
    }));
  };

  // Batch Import Handler
  const handleImportCards = ({ cards, targetType, targetDeckId, newDeckName }) => {
    if (targetType === 'new') {
      const newDeck = {
        id: 'custom_' + Date.now(),
        name: newDeckName,
        description: `批量导入包含 ${cards.length} 个单词`,
        isPreset: false,
        cards
      };
      setDecks(prev => [...prev, newDeck]);
      setActiveDeckId(newDeck.id);
    } else {
      setDecks(prevDecks => prevDecks.map(deck => {
        if (deck.id === (targetDeckId || activeDeckId)) {
          return { ...deck, cards: [...cards, ...deck.cards] };
        }
        return deck;
      }));
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col font-sans overflow-hidden bg-mac-bg text-mac-text">
      {/* macOS TitleBar Header */}
      <TitleBar
        activeView={activeView}
        setActiveView={setActiveView}
        activeDeck={activeDeck}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        autoAudio={autoAudio}
        setAutoAudio={setAutoAudio}
        cardOrder={cardOrder}
        setCardOrder={setCardOrder}
        dueCount={dueReviewCards.length}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onOpenAddCard={() => {
          setEditingCard(null);
          setIsCardEditOpen(true);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          decks={decks}
          activeDeckId={activeDeckId}
          setActiveDeckId={setActiveDeckId}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          onNewDeck={handleCreateNewDeck}
          onDeleteDeck={handleDeleteDeck}
        />

        {/* Content View Switcher */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeView === 'cards' && (
            <FlashCardView
              cards={activeDeckCards}
              activeDeckName={activeDeck ? activeDeck.name : ''}
              autoAudio={autoAudio}
              cardOrder={cardOrder}
              groupSize={groupSize}
              setGroupSize={setGroupSize}
              onUpdateCardMastery={handleUpdateCardMastery}
              onResetDeck={handleResetDeckProgress}
              onStartGroupQuiz={handleStartGroupQuiz}
            />
          )}

          {activeView === 'quiz' && (
            <SpellingQuizView
              quizCards={quizCards}
              groupIndex={quizGroupIndex}
              totalGroups={quizTotalGroups}
              onCompleteQuiz={handleCompleteQuiz}
              onRepeatQuiz={() => handleStartGroupQuiz(quizCards, quizGroupIndex, quizTotalGroups)}
              onNextGroup={() => {
                const nextIdx = quizGroupIndex + 1;
                const start = nextIdx * groupSize;
                const nextGroupCards = activeDeckCards.slice(start, start + groupSize);
                handleStartGroupQuiz(nextGroupCards, nextIdx, Math.ceil(activeDeckCards.length / groupSize));
              }}
              onBackToCards={() => setActiveView('cards')}
            />
          )}

          {activeView === 'ebbinghaus' && (
            <EbbinghausView
              allDecks={decks}
              onStartEbbinghausReview={handleStartEbbinghausReview}
            />
          )}

          {activeView === 'manage' && (
            <DeckManager
              activeDeck={activeDeck}
              onAddCard={() => {
                setEditingCard(null);
                setIsCardEditOpen(true);
              }}
              onEditCard={(card) => {
                setEditingCard(card);
                setIsCardEditOpen(true);
              }}
              onDeleteCard={handleDeleteCard}
              onDeleteMultipleCards={handleDeleteMultipleCards}
              onToggleMastery={handleToggleCardMastery}
              onOpenImportModal={() => setIsImportExportOpen(true)}
            />
          )}

          {activeView === 'stats' && (
            <StatsView decks={decks} />
          )}
        </main>
      </div>

      {/* Batch Import/Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        activeDeck={activeDeck}
        allDecks={decks}
        onImportCards={handleImportCards}
      />

      {/* Add / Edit Card Modal */}
      <CardEditModal
        isOpen={isCardEditOpen}
        onClose={() => {
          setIsCardEditOpen(false);
          setEditingCard(null);
        }}
        card={editingCard}
        onSave={handleSaveCard}
      />
    </div>
  );
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTestScore,
  calculateXPAward,
  evaluateTestAnswers,
  evaluateHardwareClassification,
  simulateAlgorithmRun,
  evaluateNetworkTopology,
  generateLearningRecommendation,
  generateCsvReport,
  AlgorithmMapConfig
} from './rules';
import { CodeBlock } from '../types/game';

test('calculateTestScore calculates percentage correctly', () => {
  assert.equal(calculateTestScore(4, 4), 100);
  assert.equal(calculateTestScore(2, 4), 50);
  assert.equal(calculateTestScore(0, 4), 0);
  assert.equal(calculateTestScore(6, 8), 75);
  assert.equal(calculateTestScore(0, 0), 0);
});

test('calculateXPAward grants XP on first clear only', () => {
  assert.equal(calculateXPAward(false, 250), 250);
  assert.equal(calculateXPAward(true, 250), 0);
});

test('evaluateTestAnswers computes correct count and breakdown', () => {
  // Test with pre-test questions
  const preIds = ['q_pre_lab', 'q_pre_algo', 'q_pre_net', 'q_pre_sec'];
  const answers = {
    q_pre_lab: 1, // Keyboard (correct)
    q_pre_algo: 0, // Urutan (correct)
    q_pre_net: 0, // Switch (correct)
    q_pre_sec: 0  // Tolak/Abaikan (correct)
  };

  const result = evaluateTestAnswers(preIds, answers);
  assert.equal(result.correctCount, 4);
  assert.equal(result.score, 100);
  assert.equal(result.breakdown['q_pre_lab'].isCorrect, true);

  // One wrong answer
  const wrongAnswers = {
    ...answers,
    q_pre_net: 2 // wrong
  };
  const resultWrong = evaluateTestAnswers(preIds, wrongAnswers);
  assert.equal(resultWrong.correctCount, 3);
  assert.equal(resultWrong.score, 75);
  assert.equal(resultWrong.breakdown['q_pre_net'].isCorrect, false);
});

test('evaluateHardwareClassification detects correct and incorrect categories', () => {
  // Correct map for all 8 items
  const placements: Record<string, string> = {
    keyboard: 'input',
    mouse: 'input',
    mic: 'input',
    cpu: 'processing',
    ram: 'storage',
    ssd: 'storage',
    monitor: 'output',
    printer: 'output'
  };

  const evalGood = evaluateHardwareClassification(placements);
  assert.equal(evalGood.isComplete, true);
  assert.equal(evalGood.correctCount, 8);
  assert.equal(evalGood.incorrectItems.length, 0);

  // Mislabeled RAM as processing
  const placementsWrong = {
    ...placements,
    ram: 'processing'
  };
  const evalWrong = evaluateHardwareClassification(placementsWrong);
  assert.equal(evalWrong.isComplete, false);
  assert.equal(evalWrong.correctCount, 7);
  assert.equal(evalWrong.incorrectItems.length, 1);
  assert.equal(evalWrong.incorrectItems[0].id, 'ram');
});

test('simulateAlgorithmRun handles linear sequence to target', () => {
  const mapConfig: AlgorithmMapConfig = {
    width: 5,
    height: 5,
    startPos: { x: 0, y: 0, dir: 'E' },
    targetPos: { x: 2, y: 0 },
    obstacles: [],
    parBlocks: 3
  };

  const blocks: CodeBlock[] = [
    { id: 'b1', type: 'forward', label: 'Maju 1 langkah' },
    { id: 'b2', type: 'forward', label: 'Maju 1 langkah' }
  ];

  const result = simulateAlgorithmRun(blocks, mapConfig);
  assert.equal(result.success, true);
  assert.equal(result.finalPos.x, 2);
  assert.equal(result.finalPos.y, 0);
  assert.equal(result.isEfficient, true);
});

test('simulateAlgorithmRun detects collision with obstacle and boundary', () => {
  const mapConfig: AlgorithmMapConfig = {
    width: 4,
    height: 4,
    startPos: { x: 0, y: 0, dir: 'S' },
    targetPos: { x: 3, y: 3 },
    obstacles: [{ x: 0, y: 1 }],
    parBlocks: 5
  };

  const blocks: CodeBlock[] = [
    { id: 'b1', type: 'forward', label: 'Maju 1 langkah' }
  ];

  const result = simulateAlgorithmRun(blocks, mapConfig);
  assert.equal(result.success, false);
  assert.equal(result.steps[0].hitObstacle, true);
  assert.match(result.errorMessage || '', /menabrak rintangan/);
});

test('simulateAlgorithmRun processes loops and branching correctly', () => {
  const mapConfig: AlgorithmMapConfig = {
    width: 5,
    height: 5,
    startPos: { x: 0, y: 0, dir: 'E' },
    targetPos: { x: 3, y: 0 },
    obstacles: [],
    parBlocks: 1
  };

  const blocks: CodeBlock[] = [
    { id: 'b1', type: 'repeat', label: 'Ulangi 3 kali', count: 3 }
  ];

  const result = simulateAlgorithmRun(blocks, mapConfig);
  assert.equal(result.success, true);
  assert.equal(result.finalPos.x, 3);
  assert.equal(result.isEfficient, true);
});

test('evaluateNetworkTopology validates LAN and WAN links', () => {
  const lanOnly = [
    { fromId: 'pc_a', toId: 'switch' },
    { fromId: 'pc_b', toId: 'switch' },
    { fromId: 'pc_c', toId: 'switch' }
  ];

  const lanEval = evaluateNetworkTopology(lanOnly);
  assert.equal(lanEval.isLanConnected, true);
  assert.equal(lanEval.canSendLocalData, true);
  assert.equal(lanEval.isWanConnected, false);

  const fullWan = [
    ...lanOnly,
    { fromId: 'switch', toId: 'router' },
    { fromId: 'router', toId: 'internet' }
  ];

  const wanEval = evaluateNetworkTopology(fullWan);
  assert.equal(wanEval.isWanConnected, true);
  assert.equal(wanEval.canSendInternetData, true);
});

test('generateLearningRecommendation provides constructive, careful feedback', () => {
  const rec = generateLearningRecommendation(
    50,
    100,
    { q_pre_lab: { isCorrect: true }, q_pre_algo: { isCorrect: false } },
    { q_post_lab_1: { isCorrect: true }, q_post_lab_2: { isCorrect: true } }
  );

  assert.equal(rec.gainScore, 50);
  assert.match(rec.overallMessage, /Luar biasa/);
  assert.equal(rec.understoodTopics.length >= 1, true);
});

test('generateCsvReport generates valid CSV content', () => {
  const csv = generateCsvReport({
    studentName: 'Aliya',
    preScore: 50,
    postScore: 100,
    totalXP: 1000,
    completedRegions: ['Laboratorium Komputer', 'Taman Algoritma'],
    understoodTopics: ['Perangkat Keras'],
    reviewTopics: [],
    timestamp: '2026-10-21 10:00'
  });

  assert.match(csv, /"Aliya"/);
  assert.match(csv, /"100\/100"/);
  assert.match(csv, /"1000 XP"/);
});

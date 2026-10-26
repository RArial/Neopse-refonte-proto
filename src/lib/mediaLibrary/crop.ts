import { MAX_CROP_ZOOM } from '@/lib/mediaLibrary/constants';
import type { AspectRatio, CropArea, QuarterTurn } from '@/types/mediaLibrary';

interface Size {
  width: number;
  height: number;
}

/**
 * Le cadre se déplace sur l'image (et non l'image sous le cadre) : le zoom réduit le cadre
 * autour de son centre. Coordonnées en fractions de l'image pivotée.
 */
export interface CropState {
  rotation: QuarterTurn;
  flipped: boolean;
  zoom: number;
  centerX: number;
  centerY: number;
}

export function rotatedSize(size: Size, rotation: QuarterTurn): Size {
  return rotation % 180 === 0 ? size : { width: size.height, height: size.width };
}

/** Plus grand cadre au ratio imposé qui tienne dans l'image, en fractions. */
function maxFrame(size: Size, ratio: AspectRatio): Size {
  const target = ratio.width / ratio.height;
  const actual = size.width / size.height;
  return actual > target ? { width: target / actual, height: 1 } : { width: 1, height: actual / target };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function clampZoom(zoom: number): number {
  return clamp(zoom, 1, MAX_CROP_ZOOM);
}

export function getCropArea(state: CropState, imageSize: Size, ratio: AspectRatio): CropArea {
  const max = maxFrame(rotatedSize(imageSize, state.rotation), ratio);
  const width = max.width / state.zoom;
  const height = max.height / state.zoom;
  const centerX = clamp(state.centerX, width / 2, 1 - width / 2);
  const centerY = clamp(state.centerY, height / 2, 1 - height / 2);
  return { x: centerX - width / 2, y: centerY - height / 2, width, height, rotation: state.rotation, flipped: state.flipped };
}

/** Réaligne le centre sur la zone réellement affichée, pour que les déplacements suivants partent du bord. */
export function normalizeCropState(state: CropState, imageSize: Size, ratio: AspectRatio): CropState {
  const area = getCropArea(state, imageSize, ratio);
  return { ...state, centerX: area.x + area.width / 2, centerY: area.y + area.height / 2 };
}

export const INITIAL_CROP_STATE: CropState = { rotation: 0, flipped: false, zoom: 1, centerX: 0.5, centerY: 0.5 };

export function cropStateFromArea(area: CropArea, imageSize: Size, ratio: AspectRatio): CropState {
  const max = maxFrame(rotatedSize(imageSize, area.rotation), ratio);
  return {
    rotation: area.rotation,
    flipped: area.flipped,
    zoom: clampZoom(max.width / area.width),
    centerX: area.x + area.width / 2,
    centerY: area.y + area.height / 2,
  };
}

export function nextQuarterTurn(rotation: QuarterTurn): QuarterTurn {
  return ((rotation + 90) % 360) as QuarterTurn;
}

export const FULL_CROP: CropArea = { x: 0, y: 0, width: 1, height: 1, rotation: 0, flipped: false };

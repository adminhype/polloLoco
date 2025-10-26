/**
 * Represents the keyboard input state for the game.
 * Each property corresponds to a specific key and is set to `true` when pressed.
 * The values are updated in real-time by keyboard or touch event handlers.
 */
class Keyboard {
    /**
     * Indicates if the LEFT arrow key is pressed.
     * @type {boolean}
     */
    LEFT = false;

    /**
     * Indicates if the RIGHT arrow key is pressed.
     * @type {boolean}
     */
    RIGHT = false;

    /**
     * Indicates if the UP arrow key is pressed.
     * @type {boolean}
     */
    UP = false;

    /**
     * Indicates if the DOWN arrow key is pressed.
     * @type {boolean}
     */
    DOWN = false;

    /**
     * Indicates if the SPACEBAR is pressed (used for jumping).
     * @type {boolean}
     */
    SPACE = false;

    /**
     * Indicates if the 'F' key is pressed (used for throwing bottles).
     * @type {boolean}
     */
    F = false;
}

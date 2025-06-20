import {withPluginApi} from 'discourse/lib/plugin-api';
import I18n from "I18n";

export default {
  name: 'bbcode-init',
  initialize (container) {
    withPluginApi ('0.8.40', api => {
      const hasAlpha = /(.,){3}|\//;
      const MAX_LENGTH = 25;

      const getVariable = value => {
        const color = value.replace(/\s/g, "");
        return hasAlpha.test(color) || color.length > MAX_LENGTH ? "" : color;
      };

      const currentLocale = I18n.currentLocale();

      I18n.translations[currentLocale].js.composer.placeholder_coloured_text = settings.default_text;

      const createColorPicker = (composer) => {
        const modal = document.createElement('div');
        modal.className = 'color-picker-modal';
        modal.innerHTML = `
          <div class="color-picker-content">
            <h3>${I18n.t(themePrefix('composer.color_picker_title'))}</h3>
            <div class="color-section">
              <label>${I18n.t(themePrefix('composer.text_color'))}</label>
              <div class="color-options">
                <input type="color" id="text-color-picker" value="#${settings.default_foreground_colour}">
                <div class="preset-colors">
                  <div class="color-preset" data-color="black" style="background-color: black"></div>
                  <div class="color-preset" data-color="white" style="background-color: white; border: 1px solid #ccc"></div>
                  <div class="color-preset" data-color="red" style="background-color: red"></div>
                  <div class="color-preset" data-color="blue" style="background-color: blue"></div>
                  <div class="color-preset" data-color="green" style="background-color: green"></div>
                  <div class="color-preset" data-color="yellow" style="background-color: yellow"></div>
                  <div class="color-preset" data-color="purple" style="background-color: purple"></div>
                  <div class="color-preset" data-color="orange" style="background-color: orange"></div>
                </div>
              </div>
            </div>
            <div class="color-section">
              <label>${I18n.t(themePrefix('composer.background_color'))}</label>
              <div class="color-options">
                <input type="color" id="bg-color-picker" value="#${settings.default_background_colour}">
                <div class="preset-colors">
                  <div class="color-preset bg-preset" data-color="transparent" style="background: repeating-linear-gradient(45deg, transparent, transparent 5px, #ccc 5px, #ccc 10px)"></div>
                  <div class="color-preset bg-preset" data-color="black" style="background-color: black"></div>
                  <div class="color-preset bg-preset" data-color="white" style="background-color: white; border: 1px solid #ccc"></div>
                  <div class="color-preset bg-preset" data-color="lightgray" style="background-color: lightgray"></div>
                  <div class="color-preset bg-preset" data-color="lightblue" style="background-color: lightblue"></div>
                  <div class="color-preset bg-preset" data-color="lightgreen" style="background-color: lightgreen"></div>
                  <div class="color-preset bg-preset" data-color="lightyellow" style="background-color: lightyellow"></div>
                  <div class="color-preset bg-preset" data-color="lightpink" style="background-color: lightpink"></div>
                </div>
              </div>
            </div>
            <div class="preview-section">
              <label>${I18n.t(themePrefix('composer.preview'))}</label>
              <div class="color-preview">預覽文字 Preview Text</div>
            </div>
            <div class="button-section">
              <button class="btn-primary apply-color">${I18n.t(themePrefix('composer.apply'))}</button>
              <button class="btn-secondary cancel-color">${I18n.t(themePrefix('composer.cancel'))}</button>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        const textColorPicker = modal.querySelector('#text-color-picker');
        const bgColorPicker = modal.querySelector('#bg-color-picker');
        const preview = modal.querySelector('.color-preview');
        const applyBtn = modal.querySelector('.apply-color');
        const cancelBtn = modal.querySelector('.cancel-color');

        const updatePreview = () => {
          const textColor = textColorPicker.value;
          const bgColor = bgColorPicker.value;
          preview.style.color = textColor;
          preview.style.backgroundColor = bgColor;
          preview.style.padding = '4px 8px';
          preview.style.borderRadius = '3px';
        };

        textColorPicker.addEventListener('input', updatePreview);
        bgColorPicker.addEventListener('input', updatePreview);

        modal.querySelectorAll('.color-preset:not(.bg-preset)').forEach(preset => {
          preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            if (color === 'white') {
              textColorPicker.value = '#ffffff';
            } else if (color === 'black') {
              textColorPicker.value = '#000000';
            } else if (color === 'red') {
              textColorPicker.value = '#ff0000';
            } else if (color === 'blue') {
              textColorPicker.value = '#0000ff';
            } else if (color === 'green') {
              textColorPicker.value = '#008000';
            } else if (color === 'yellow') {
              textColorPicker.value = '#ffff00';
            } else if (color === 'purple') {
              textColorPicker.value = '#800080';
            } else if (color === 'orange') {
              textColorPicker.value = '#ffa500';
            }
            updatePreview();
          });
        });

        modal.querySelectorAll('.bg-preset').forEach(preset => {
          preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            if (color === 'transparent') {
              bgColorPicker.value = '#ffffff';
              preview.style.backgroundColor = 'transparent';
            } else {
              if (color === 'white') {
                bgColorPicker.value = '#ffffff';
              } else if (color === 'black') {
                bgColorPicker.value = '#000000';
              } else if (color === 'lightgray') {
                bgColorPicker.value = '#d3d3d3';
              } else if (color === 'lightblue') {
                bgColorPicker.value = '#add8e6';
              } else if (color === 'lightgreen') {
                bgColorPicker.value = '#90ee90';
              } else if (color === 'lightyellow') {
                bgColorPicker.value = '#ffffe0';
              } else if (color === 'lightpink') {
                bgColorPicker.value = '#ffb6c1';
              }
              updatePreview();
            }
          });
        });

        applyBtn.addEventListener('click', () => {
          const textColor = textColorPicker.value.replace('#', '');
          const bgColor = bgColorPicker.value.replace('#', '');
          composer.applySurround(`[wrap=color color=${textColor} bgcolor=${bgColor}]`, '[/wrap]', 'placeholder_coloured_text');
          document.body.removeChild(modal);
        });

        cancelBtn.addEventListener('click', () => {
          document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            document.body.removeChild(modal);
          }
        });

        updatePreview();
      };

      api.onToolbarCreate(toolbar => {
        toolbar.addButton({
          id: "color_ui_button",
          group: "extras",
          icon: "palette",
          title: themePrefix('composer.color_ui_button_title'),
          perform: e => createColorPicker(e)
        });
      });

      api.decorateCookedElement(
        post => {
          post
            .querySelectorAll("[data-color]")
            .forEach(i =>
              i.style.setProperty("--color", getVariable(i.dataset.color))
            );

          post
            .querySelectorAll("[data-bgcolor]")
            .forEach(i =>
              i.style.setProperty("--bgcolor", getVariable(i.dataset.bgcolor))
            );
        },
        { id: "wrap-colors" }
      );
    })
  }
}

'use strict';

const { GObject, Gtk, Gio } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const log_this = Convenience.log_this;

const getClockSecondsSettings = Convenience.getClockSecondsSettings;
const version_data = Convenience.version_data;
const isGnome40 = Convenience.isGnome40;

function init() {
    log_this(`Initializing Preferences...`);
}

const UTCClockSettingsBox = new GObject.Class({
    Name: 'UTCClock.Prefs.UTCClockSettingsBox',
    GTypeName: 'UTCClockSettingsBox',
    Extends: Gtk.ScrolledWindow,

    _init: function (params) {
        this.parent(params);

        this._settings = Convenience.getSettings();

        let builder = new Gtk.Builder();
        builder.set_translation_domain('gettext-domain');
        builder.add_from_file(Me.path + (isGnome40 ? '/prefs40.ui' : '/prefs.ui'));

        if (isGnome40)
            this.set_child(builder.get_object('main_prefs'));
        else
            this.add(builder.get_object('main_prefs'));

        if (getClockSecondsSettings()) {
            this._settings.bind('show-seconds', builder.get_object('widget1'), 'active', Gio.SettingsBindFlags.DEFAULT);
            builder.get_object('image1').icon_name = null;
        } else {
            builder.get_object('widget1').set_sensitive(false);
            builder.get_object('image1').icon_name = 'dialog-warning-symbolic';
            builder.get_object('image1').set_tooltip_text('Disabled. Go to GNOME Tweaks and enable Seconds in the "Top Bar" section to enable.');
        }
        this._settings.bind('time-text', builder.get_object('widget2'), 'active-id', Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind('show-date', builder.get_object('widget3'), 'active', Gio.SettingsBindFlags.DEFAULT);
        this._settings.bind('light-opacity', builder.get_object('widget4'), 'active', Gio.SettingsBindFlags.DEFAULT);
    }

});

function buildPrefsWidget() {
    let box = new UTCClockSettingsBox();
    if (!isGnome40)
        box.show_all();
    return box;
}
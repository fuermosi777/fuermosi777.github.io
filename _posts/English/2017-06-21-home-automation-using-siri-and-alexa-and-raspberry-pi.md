---
title: Home automation with Siri, Alexa, and Raspberry PI 3
layout: post
category: English
tags:
- rpi
---

* TOC
{:toc}

## Introduction

I am renting an 1b1b apartment in Silicon Valley. It is not a big apartment and yet has many confusing power switches which were obviously designed by qualified project managers. 

The wall switch near the door controls one of the outlet in the living room. I connected it to a floor lamp so that I can turn on the light when I got home. If I want to turn it off, however, I have to leave my comfortable sofa and walk to the door to turn the light off. Not saying I am a lazy person, but home is supposed to be a place to make people feel lazy.

Another thing that bothers me is that I often carry a lot of things when I enter or leave the apartment, making myself very hard to take out the key to lock/unlock the door. I just hope the door can be smart like it in some modern cars so that it can lock/unlock itself.

I also have a lot of entertainment devices such TV, projector, sound bar, PS4. It's frustrated every time to have at least 3 remotes on hand and open them one by one.

That's why I started my smart home project which based on the following high-level goals I want to achieve.

## High-level Goals

- Turn on/off all major lights in the apartment by just saying "Turn on/off the light"
- Lock/unlock the door without using my key, or even my attention
- Open/close blinds automatically or by sound control
- Open/close window with sound
- Control A/C with sound
- Wake me up with different songs every day
- Control TV, projector, sound bar, Apple TV, PS4 without using tons of remotes

## Hardware

- Raspberry PI 3 Model B
- RioRand(TM) 433MHz RF transmitter and receiver
- Etekcity Wireless Remote Outlets
- Echo Dot (2nd Gen)
- MagicW 38KHz IR transmitter and receiver
- Futaba S3003 Servo

## Setup Raspberry PI

1. Make an order of all devices via Amazon. Received after two days.
2. Download [Raspbian](https://www.raspberrypi.org/downloads/raspbian/). Note that no need to burn image to USB drive described in the docs. Just unzipping the file and copying and pasting everything to the USB drive.
3. Connect Raspberry PI to keyboard, monitor via HDMI port, mouse.
4. Install Raspbian Jessie.
5. Setup Wifi Connection and enable SSH. Change the computer name to "pi". Change the default password.
6. Test SSH connection: `$ ssh pi@pi.local`
7. Install Nodejs: 
  - `$ sudo apt-get update`
  - `$ curl -sLS https://apt.adafruit.com/add | sudo bash`
  - `$ sudo apt-get install node`
8. Install Vim: `$ sudo apt-get vim`

## Lights

The idea of controlling lights is using cheap RF remote outlets and RF transmitter. Plugging a RF outlet into wall, hacking the remote on/off RF code, then using Siri or Alexa to control.

First connect the RF transmitter and receiver to Raspberry PI.

## A/C

A/C remote is using Infrared Remote signal. Need to do similar to lights.

First connect IR transmitter and receiver to Raspberry PI. The receiver connects to GPIO 23 pin and transmitter connects to 22.

### Setting up LIRC

Install LIRC:

```sh
$ sudo apt-get install lirc
```

Add following text to `/etc/modules` file:

```md
lirc_dev
lirc_rpi gpio_in_pin=23 gpio_out_pin=22
```

Update the `/etc/lirc/hardware.conf` file:

```
# /etc/lirc/hardware.conf
#
# Arguments which will be used when launching lircd
LIRCD_ARGS="--uinput"

# Don't start lircmd even if there seems to be a good config file
# START_LIRCMD=false

# Don't start irexec, even if a good config file seems to exist.
# START_IREXEC=false

# Try to load appropriate kernel modules
LOAD_MODULES=true

# Run "lircd --driver=help" for a list of supported drivers.
DRIVER="default"
# usually /dev/lirc0 is the correct setting for systems using udev
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"

# Default configuration files for your hardware if any
LIRCD_CONF=""
LIRCMD_CONF=""
```

Start `lircd`:

```
$ sudo /etc/init.d/lirc stop
$ sudo /etc/init.d/lirc start
```

Edit `/boot/config.txt`:

```
dtoverlay=lirc-rpi,gpio_in_pin=23,gpio_out_pin=22
```

Reboot:

```
$ sudo reboot
```

### Testing IR receiver

List all keys:

```
$ irrecord --list-namespace
```

Recording IR signals:

```
# Stop lirc to free up /dev/lirc0
sudo /etc/init.d/lirc stop

# Create a new remote control configuration file (using /dev/lirc0) and save the output to ~/lircd.conf
irrecord -d /dev/lirc0 ~/lircd.conf

# Make a backup of the original lircd.conf file
sudo mv /etc/lirc/lircd.conf /etc/lirc/lircd_original.conf

# Copy over your new configuration file
sudo cp ~/lircd.conf /etc/lirc/lircd.conf

# Start up lirc again
sudo /etc/init.d/lirc start
```

Can change the name of the device file from `/home/xxx` to `AC`

### Sending IR signal

```
# List all of the commands that LIRC knows for 'yamaha'
irsend LIST AC ""

# Send the KEY_POWER command once
irsend SEND_ONCE AC KEY_POWER
```

## to be continued...


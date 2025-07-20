FROM node:lts-buster

# Enstale depandans
RUN apt-get update && \
  apt-get install -y \
    ffmpeg \
    imagemagick \
    libwebp-tools && \
  apt-get upgrade -y && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json .

RUN npm install && npm install -g qrcode-terminal pm2

# Copy the rest of the project files
COPY . .

# Expose the port your app will use
EXPOSE 5000

# Start the app
CMD ["npm", "start"]

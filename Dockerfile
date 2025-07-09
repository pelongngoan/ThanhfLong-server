# Stage 1: Build the TypeScript code
FROM node:20-alpine AS builder

# Tạo thư mục ứng dụng
WORKDIR /app

# Copy các file config và cài dependencies
COPY package*.json ./
RUN npm ci

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Stage 2: Chạy app với mã đã build
FROM node:20-alpine

WORKDIR /app

# Copy dependencies và mã đã build từ stage trước
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Thiết lập biến môi trường (nếu cần)
# ENV NODE_ENV=production

# Mặc định Node chạy file từ dist (đã được build)
CMD ["node", "dist/app.js"]

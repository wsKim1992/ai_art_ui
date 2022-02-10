const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV;

const indexEntryFile = path.resolve(__dirname,'index');
const sub03EntryFile = path.resolve(__dirname+'/js/sub_03');

const outputDir = path.resolve(__dirname,'dist');
const fs = require('fs');

const indexHtmlFile = path.resolve(__dirname,'index.html');
const sub01HtmlFile = path.resolve(__dirname,'sub_01.html');
const sub02HtmlFile = path.resolve(__dirname,'sub_02.html');
const sub03HtmlFile = path.resolve(__dirname,'sub_03.html');
const sub04HtmlFile = path.resolve(__dirname,'sub_04.html');
const webpack = require('webpack');

const config = {
    mode:mode,
    entry:{
        index:indexEntryFile,
        sub_03:sub03EntryFile, 
    },
    resolve:{
        //특정 파일의 변수들을 전역적으로 쓸 수 있게 하기 위해 각 파일에서 불러옴.
        alias:{
            jQuery:path.resolve(__dirname,'./js/jquery'),
            inputImgSrc:path.resolve(__dirname,'./js/global_variables'),
        },
        extensions:['.js'],
    },
    output:{
        filename:'[name].bundle.js',
        path:outputDir,
        publicPath:'/'
    },
    devtool:'inline-source-map',
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                },
            },
            {
                test:/\.css$/,
                use:[mode==='development'?'style-loader':MiniCssExtractPlugin.loader,'css-loader'],
            },
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template:indexHtmlFile,
            chunks:['index'],
            minify:{
                collapseWhitespace:true,
                removeComments:true,
            }
        }),
        new HtmlWebpackPlugin({
            filename:'sub_01.html',
            template:sub01HtmlFile,
            chunks:['index'],
            minify:{
                collapseWhitespace:true,
                removeComments:true,
            }
        }),
        new HtmlWebpackPlugin({
            filename:'sub_02.html',
            template:sub02HtmlFile,
            chunks:['index'],
            minify:{
                collapseWhitespace:true,
                removeComments:true,
            }
        }),
        new HtmlWebpackPlugin({
            filename:'sub_04.html',
            template:sub04HtmlFile,
            minify:{
                collapseWhitespace:true,
                removeComments:true,
            },
            chunks:['index'],
            excludeChunks:[
                'sub_03',
            ],
        }),
        new HtmlWebpackPlugin({
            filename:'sub_03.html',
            template:sub03HtmlFile,
            minify:{
                collapseWhitespace:true,
                removeComments:true,
            },
            chunks:['sub_03','index'],
        }),
        ...(mode==='production'?[new MiniCssExtractPlugin({
            filename:"[name].css"
        })]:[]),
        //위에서 불러온 전역 변수들을 import/require 한 것 처럼 쓸 수 있게 해줌.
        new webpack.ProvidePlugin({
            $:'jQuery',
            jQuery:'jQuery',
            inputImgSrc:'inputImgSrc'
        }),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from:'font',
                    to:'font'
                },{
                    from:'img',
                    to:'img'
                },{
                    from:'js',
                    to:'js'
                },{
                    from:'plugin',
                    to:'plugin'
                }
            ]
        })
    ],
    devServer:{
        static:[
            {
                directory:path.join(__dirname,"font/"),
                publicPath:'/font',
                watch:true,
            },{
                directory:path.join(__dirname,"img/"),
                publicPath:'/img',
                watch:true,
            },{
                directory:path.join(__dirname,"js/"),
                publicPath:'/js',
                watch:true,
            },{
                directory:path.join(__dirname,"plugin/"),
                publicPath:'/plugin',
                watch:true,
            }
        ],
        port:8083,
        host:'localhost',
        open:true,
        proxy:{
            "/api":{
                target:`http://${process.env.API_URL}:${process.env.API_PORT}`,
                secure:false,
                changeOrigin:true,
                pathRewrite:{
                    "/api":"/transfer"
                }
            },
            "/static":`http://${process.env.API_URL}:${process.env.API_PORT}`
        }
    }
}

module.exports = config;
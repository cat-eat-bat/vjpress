---
outline: deep
---

# Adminpress

`Adminpress` is a simple and lightweight admin web page generator.

一个用来快速生成后台管理页面的工具。

## 特性

- 轻量级、简单易用
- 快速上手，提供了服务端依赖 方便集成
- 支持站点主题配置
- 支持暗模式适配

## 快速开始

### 前置条件

假设你对 springboot 开发有一定的了解，`adminpress` 采用类似 `sidercar` 的方式，提供相应能力。

### 服务端集成

你已经有了一个 springboot 的业务应用，可以快速的集成 `Adminpress`的服务端能力：

1. 引入依赖

```xml
<dependency>
    <groupId>org.winterfell</groupId>
    <artifactId>adminpress-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

2. 配置 `Adminpress` 的相关配置

```yaml
aps:
  data-sources:
    default:
      url: jdbc:postgresql://127.0.0.1/db?currentSchema=public
      username: my
      password: xxxxxx
      driver-class-name: org.postgresql.Driver
  settings:
    entity-packages: org.winterfell.adminpress.core.db.entity
    ddl-auto: create_if_not_exist
    show-sql: true
    dev-mode: true
  metadata:
    ignores: qual_.*,dict.*  # 忽略表(可以通过接口再接入)
```

3. 启动应用

在应用启动类中配置扫描包, 如下：
```java
@SpringBootApplication(scanBasePackages = {"org.winterfell"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

启动应用，访问 访问 `ip:port/aps` 即可看到相关接口地址。

### 客户端集成

将编译后的`adminpress`放进和应用同目录下，重启nginx后即可访问 `ip:port/adminpress/`。

## 服务端配置

主要用于配置`adminpress` 的数据源，以及相关元数据信息:

```yaml
aps:
  data-sources:
    default:    # 配置默认数据源
      url: jdbc:postgresql://127.0.0.1/db?currentSchema=public
      username: my
      password: xxxxxx
      driver-class-name: org.postgresql.Driver
  settings:
    entity-packages: org.winterfell.adminpress.core.db.entity
    ddl-auto: create_if_not_exist
  metadata:  # 应用启动时 会自动将数据源中的表信息都加入到元数据中，这里配置哪些表不希望被加入元数据中
    ignores: qual_.*,dict.*  # 忽略表(可以通过接口再接入)
```

## 站点配置

### 配置global.js

需要修改`adminpress`目录下的`global.js`文件，修改其中的`siteConfig`属性。

```js
// 站点配置
window.siteConfig = {
  name: 'sgb',
  mode: 'local', // local 本地json文件 remote 服务端
  // 数据请求基础地址，默认/aps 若实际服务有其他地址，可修改
  baseUrl: '/aps'
}
```

### 站点配置文件

用于配置站点主题、页面配置、接口信息等的配置文件，是生成页面的核心, 示例如下：

```json
{
  "title": "XXX系统管理后台",
  "logo": "https://via.placeholder.com/60/92c952",
  "headless": true,
  "theme": {
    "default": "light",
    "primary": "#367AFF",
    "login": {
      "backgroundImage": "images/login/bg_light.png",
      "formPosition": "left",
      "withCaptcha": false
    },
    "main": {
      "bgColor": {
        "default": "#f0f2f5"
      }
    },
    "table": {
      "thColor": {
        "default": "#D6E1F1",
        "dark": "#D6E1F1"
      }
    }
  },
  "apiUrls": {
    "login": "/aps/login",
    "captcha": "/aps/captcha"
  },
  "pages": [
    {
      "name": "Log",
      "path": "/log",
      "title": "日志管理",
      "redirect": "/log/audit",
      "type": "group",
      "icon": "fas fa-book",
      "children": [
        {
          "name": "LogAudit",
          "path": "/log/audit",
          "title": "操作日志",
          "type": "curd",
          "meta": {
            "authRequired": false,
            "curd": {
              "metaName": "audit_log",
              "options": {
                "disableCreateNew": true,
                "disableDeleteBatch": true,
                "hideOptColumn": true,
                "preQuery": "log_type:!=登录"
              },
              "fields": [
                {
                  "key": "log_type",
                  "label": "操作类型",
                  "type": "string",
                  "query": {
                    "grid": 8,
                    "visible": true
                  },
                  "table": {
                    "visible": true,
                    "width": 160
                  }
                },
                {
                  "key": "module",
                  "label": "操作模块",
                  "type": "string",
                  "query": {
                    "grid": 8,
                    "visible": true
                  },
                  "table": {
                    "visible": true
                  }
                },
                {
                  "key": "username",
                  "label": "用户名",
                  "type": "string",
                  "query": {
                    "grid": 8,
                    "visible": true
                  },
                  "table": {
                    "visible": true,
                    "width": 120
                  }
                },
                {
                  "key": "client_ip",
                  "label": "主机IP",
                  "type": "string",
                  "query": {
                    "visible": false,
                    "grid": 8
                  },
                  "table": {
                    "visible": true
                  }
                },
                {
                  "key": "client_type",
                  "label": "客户端类型",
                  "type": "string",
                  "query": {
                    "grid": 8,
                    "visible": false,
                    "comp": "select",
                    "valueOptions": [
                      {
                        "label": "电脑",
                        "value": "PC"
                      },
                      {
                        "label": "移动端",
                        "value": "APP"
                      }
                    ]
                  },
                  "table": {
                    "width": 120,
                    "visible": true
                  }
                },
                {
                  "key": "log_time",
                  "label": "操作时间",
                  "type": "datetime",
                  "table": {
                    "visible": true
                  }
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "UserAndRole",
      "path": "/users",
      "title": "账户管理",
      "redirect": "/users/user",
      "type": "group",
      "icon": "fas fa-user-cog",
      "children": [
        {
          "name": "UserMng",
          "path": "/users/user",
          "title": "用户管理",
          "type": "curd",
          "meta": {
            "authRequired": false,
            "curd": {
              "metaName": "account",
              "options": {
                "disableDeleteBatch": true,
                "dslOrderBy": "create_at desc,update_at desc",
                "autoGenFields": {
                  "create": [
                    {
                      "key": "enabled",
                      "value": true
                    }
                  ]
                }
              },
              "fields": [
                {
                  "key": "user_name",
                  "label": "账号",
                  "type": "string",
                  "query": {
                    "grid": 6,
                    "visible": true
                  },
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true,
                    "required": true
                  }
                },
                {
                  "key": "password",
                  "label": "密码",
                  "type": "string",
                  "form": {
                    "visible": true,
                    "required": true,
                    "encrypt": "bcrypt",
                    "options": {
                      "type": "password",
                      "input-props": {
                        "autocomplete": "new-password"
                      }
                    }
                  }
                },
                {
                  "key": "real_name",
                  "label": "用户名",
                  "type": "string",
                  "query": {
                    "grid": 6,
                    "visible": true
                  },
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true,
                    "required": true
                  }
                },
                {
                  "key": "phone",
                  "label": "手机号",
                  "type": "string",
                  "query": {
                    "grid": 6,
                    "visible": true
                  },
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true
                  }
                },
                {
                  "key": "address",
                  "label": "地址",
                  "type": "string",
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true
                  }
                },
                {
                  "key": "region_code",
                  "label": "行政区代码",
                  "type": "string",
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true
                  }
                },
                {
                  "key": "password_update_at",
                  "label": "密码修改时间",
                  "type": "datetime",
                  "table": {
                    "visible": true
                  }
                },
                {
                  "key": "create_at",
                  "label": "创建时间",
                  "type": "datetime",
                  "table": {
                    "visible": true
                  }
                },
                {
                  "key": "update_at",
                  "label": "更新时间",
                  "type": "datetime",
                  "table": {
                    "visible": true
                  }
                }
              ]
            }
          }
        },
        {
          "name": "AuthMng",
          "path": "/users/auth",
          "title": "权限管理",
          "type": "curd",
          "meta": {
            "authRequired": false,
            "curd": {
              "metaName": "permission",
              "options": {
                "dslOrderBy": "create_at desc,update_at desc",
                "disablePagination": true,
                "disableDeleteBatch": true,
                "hideSerialColumn": true,
                "dataFetch": {
                  "method": "get",
                  "url": "/dataMan/api/v1/manage/permission/list"
                }
              },
              "fields": [
                {
                  "key": "content",
                  "label": "权限内容",
                  "type": "string",
                  "query": {
                    "grid": 6,
                    "visible": true
                  },
                  "table": {
                    "visible": true,
                    "align": "left"
                  },
                  "form": {
                    "visible": true,
                    "required": true
                  }
                },
                {
                  "key": "path",
                  "label": "访问路径",
                  "type": "string",
                  "query": {
                    "grid": 6,
                    "visible": true
                  },
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true,
                    "required": true
                  }
                },
                {
                  "key": "type",
                  "label": "类型",
                  "type": "boolean",
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "visible": true
                  }
                },
                {
                  "key": "description",
                  "label": "描述",
                  "type": "string",
                  "table": {
                    "visible": true
                  },
                  "form": {
                    "comp": "textarea",
                    "visible": true
                  }
                },
                {
                  "key": "create_at",
                  "label": "创建时间",
                  "type": "datetime",
                  "table": {
                    "visible": true
                  }
                },
                {
                  "key": "update_at",
                  "label": "更新时间",
                  "type": "datetime",
                  "table": {
                    "visible": true
                  }
                }
                
              ]
            }
          }
        }
      ]
    },
    {
      "name": "SysConf",
      "path": "/conf",
      "title": "系统配置",
      "redirect": "/conf/xzq",
      "type": "group",
      "icon": "fas fa-cog",
      "children": [
        {
          "name": "XzqPage",
          "path": "/conf/xzq",
          "title": "行政区划",
          "type": "custom",
          "meta": {
            "authRequired": false
          }
        }
      ]
    }
  ]
}
```

